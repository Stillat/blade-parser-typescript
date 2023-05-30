import * as fs from 'fs';
import * as path from 'path';
const { execSync } = require('child_process');
import { BladeComponentNode, BladeEchoNode, DirectiveNode, InlinePhpNode, ParameterType } from '../nodes/nodes';
import { BladeDocument } from './bladeDocument';
import { StringUtilities } from '../utilities/stringUtilities';
import { PintCache } from './pintCache';

/**
 * The PintTransformer class will take an input document
 * and extract PHP from directive arguments, inline PHP
 * and from @php(...), @php/@endphp blocks and create
 * a temporary file with special markers that is
 * then supplied to Laravel Pint for formatting.
 * 
 * Each type of language construct (like @foreach, @forelse)
 * is handled in a special way to make sure Laravel Pint
 * receives valid PHP input to format. Once Laravel Pint
 * has finished its formatting and fixing, the output
 * is re-processed and the formatting PHP code is
 * then extracted based on the file's markers.
 */
export class PintTransformer {
    private tmpDir: string = '';
    private cacheDir: string = '';
    private resultMapping: Map<string, string> = new Map();
    private contentMapping: Map<string, string> = new Map();
    private pintCommand: string = '';
    private templateFile: string = '';
    private cache: PintCache;
    private wasCached = false;
    private outputPintResults = false;
    private markerSuffix = '';
    private forceDoublePint = false;
    private phpDocs: Map<string, string> = new Map();
    private phpTagDocs: Map<string, string> = new Map();
    private cleanupFiles: string[] = [];

    constructor(tmpFilePath: string, cacheDir: string, pintCommand: string) {
        this.tmpDir = tmpFilePath;
        this.cacheDir = cacheDir;

        this.markerSuffix = this.markerSuffix + StringUtilities.makeSlug(27);

        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir);
        }

        this.cache = new PintCache(this.cacheDir);

        if (!fs.existsSync(this.tmpDir)) {
            fs.mkdirSync(this.tmpDir);
        }

        this.pintCommand = pintCommand;
    }

    setTemplateFilePath(path: string) {
        this.templateFile = path;
    }

    getTemplateFile(): string {
        return this.templateFile;
    }

    /**
     * Prepares the content for the internal result mapping and cache.
     * 
     * All whitespace except for newlines will be removed from the
     * input string. Before Laravel Pint is invoked, we have to
     * check the incoming document content with what is we
     * have in the cache. Newlines are excluded as they
     * can change the output/results of Pint a lot.
     * 
     * @param input
     * @returns 
     */
    private prepareContent(input: string): string {
        const whitespacePattern = /[^\S\n]/g;
        const quotePattern = /['"`]/g;

        let result = input.replace(whitespacePattern, '');

        result = result.replace(quotePattern, '');

        return result;
    }

    getResultMapping(): Map<string, string> {
        return this.resultMapping;
    }

    getPhpBlockContent(php: InlinePhpNode): string {
        if (php.overrideContent != null && this.resultMapping.has(php.overrideContent)) {
            return this.resultMapping.get(php.overrideContent) as string;
        }

        // Handle the case of nested child documents having different index values.
        const preparedPhpContent = this.prepareContent(php.sourceContent);
        if (this.contentMapping.has(preparedPhpContent)) {
            const originalIndex = this.contentMapping.get(preparedPhpContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        return php.sourceContent;
    }

    getEchoContent(echo: BladeEchoNode): string {
        if (echo.overrideContent != null && this.resultMapping.has(echo.overrideContent)) {
            return this.resultMapping.get(echo.overrideContent) as string;
        }

        // Handle the case of nested child documents having different index values.
        const preparedEchoContent = this.prepareContent(echo.content);
        if (this.contentMapping.has(preparedEchoContent)) {
            const originalIndex = this.contentMapping.get(preparedEchoContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        return echo.content;
    }

    getDirectiveContent(directive: DirectiveNode): string {
        if (directive.overrideParams != null && this.resultMapping.has(directive.overrideParams)) {
            return this.resultMapping.get(directive.overrideParams) as string;
        }

        // Handle the case of nested child documents having different index values.
        const preparedParams = this.prepareContent(directive.directiveParameters);
        if (this.contentMapping.has(preparedParams)) {
            const originalIndex = this.contentMapping.get(preparedParams) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        return directive.directiveParameters;
    }

    getDirectivePhpContent(directive: DirectiveNode): string {

        if (directive.overrideParams != null && this.resultMapping.has(directive.overrideParams)) {
            return this.resultMapping.get(directive.overrideParams) as string;
        }

        // Handle the case of nested child documents having different index values.
        const preparedContent = this.prepareContent(directive.documentContent);
        if (this.contentMapping.has(preparedContent)) {
            const originalIndex = this.contentMapping.get(preparedContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        return directive.documentContent;
    }

    transform(document: BladeDocument): string {
        let results = '',
            replaceIndex = 0;

        document.getAllNodes().forEach((node) => {
            if (node instanceof DirectiveNode) {
                if (node.directiveName == 'php' && node.isClosedBy != null && node.hasValidPhp()) {
                    const candidate = node.documentContent.trim();

                    if (candidate.length == 0) { return; }

                    //this.forceDoublePint = true;
                    let phpDoc = '';
                    //results += replaceIndex.toString() + '=PHP' + this.markerSuffix;
                    //results += "\n";
                    phpDoc += '<?php ' + "\n";
                    StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                        phpDoc += cLine + "\n";
                    });
                    phpDoc += "\n";
                    node.overrideParams = '__pint' + replaceIndex.toString();

                    const preparedContent = this.prepareContent(node.documentContent);
                    if (!this.contentMapping.has(preparedContent)) {
                        this.contentMapping.set(preparedContent, node.overrideParams);
                    }

                    this.phpDocs.set(node.overrideParams, phpDoc);

                    replaceIndex += 1;
                } else {
                    if (node.hasDirectiveParameters && !node.hasJsonParameters && node.hasValidPhp()) {
                        if (node.directiveName == 'php') {
                            const candidate = node.directiveParameters.substring(1, node.directiveParameters.length - 1).trim();

                            if (candidate.length == 0) { return; }

                            // this.forceDoublePint = true;

                            results += replaceIndex.toString() + '=IPD' + this.markerSuffix;
                            results += "\n";
                            results += '<?php ';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            });
                            results = results.trimRight();
                            results += '; ?>';
                            results += "\n";
                            node.overrideParams = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(node.directiveParameters);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, node.overrideParams);
                            }

                            replaceIndex += 1;
                        } else if (node.directiveName == 'forelse' || node.directiveName == 'foreach') {
                            const candidate = node.directiveParameters.substring(1, node.directiveParameters.length - 1).trim();

                            if (candidate.length == 0) { return; }

                            results += replaceIndex.toString() + '=FRL' + this.markerSuffix;
                            results += "\n";
                            results += '<?php foreach(';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            })
                            results += ') {} ?>';
                            results += "\n";
                            node.overrideParams = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(node.directiveParameters);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, node.overrideParams);
                            }

                            replaceIndex += 1;
                        } else {
                            const candidate = node.directiveParameters.substring(1, node.directiveParameters.length - 1).trim();

                            if (candidate.length == 0) { return; }

                            results += replaceIndex.toString() + '=DIR' + this.markerSuffix;
                            results += "\n";
                            results += '<?php $tVar = ';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            })
                            results += '; ?>';
                            results += "\n";
                            node.overrideParams = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(node.directiveParameters);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, node.overrideParams);
                            }

                            replaceIndex += 1;
                        }
                    }
                }
            } else if (node instanceof BladeEchoNode && node.hasValidPhp()) {
                const candidate = node.content.trim();

                if (candidate.length == 0) { return; }

                results += replaceIndex.toString() + '=ECH' + this.markerSuffix;
                results += "\n";
                results += '<?php echo ';
                StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                    results += cLine.trimLeft() + "\n";
                })
                results = results.trimRight();
                results += '; ?>';
                results += "\n";
                node.overrideContent = '__pint' + replaceIndex.toString();

                const preparedParameters = this.prepareContent(node.content);
                if (!this.contentMapping.has(preparedParameters)) {
                    this.contentMapping.set(preparedParameters, node.overrideContent);
                }

                replaceIndex += 1;
            } else if (node instanceof BladeComponentNode) {
                if (node.parameters.length) {
                    node.parameters.forEach((param) => {
                        if (param.type == ParameterType.Directive && param.directive != null && !param.directive.hasJsonParameters && param.directive.hasValidPhp()) {
                            const candidate = param.directive.directiveParameters.substring(1, param.directive.directiveParameters.length - 1).trim();

                            if (candidate.length == 0) { return; }

                            results += replaceIndex.toString() + '=DIR' + this.markerSuffix;
                            results += "\n";
                            results += '<?php $tVar = ';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            })
                            results += ' ?>';
                            results += "\n";
                            param.directive.overrideParams = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(param.directive.directiveParameters);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, param.directive.overrideParams);
                            }

                            replaceIndex += 1;
                        } else if (param.type == ParameterType.InlineEcho && param.inlineEcho != null && param.inlineEcho.hasValidPhp()) {
                            const candidate = param.inlineEcho.content.trim();
                            results += replaceIndex.toString() + '=ECH' + this.markerSuffix;
                            results += "\n";
                            results += '<?php echo ';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            })
                            results = results.trimRight();
                            results += '; ?>';
                            results += "\n";
                            param.inlineEcho.overrideContent = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(param.inlineEcho.content);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, param.inlineEcho.overrideContent);
                            }

                            replaceIndex += 1;
                        }
                    });
                }
            } else if (node instanceof InlinePhpNode && node.hasValidPhp()) {
                const candidate = node.sourceContent.trim();

                let checkCandidate = candidate.substring(5).trimLeft();
                checkCandidate = checkCandidate.trimRight().substring(0, checkCandidate.length - 2).trim();

                if (checkCandidate.length == 0) { return; }

                //this.forceDoublePint = true;


                node.overrideContent = '__pint' + replaceIndex.toString();

                const preparedContent = this.prepareContent(node.sourceContent);
                if (!this.contentMapping.has(preparedContent)) {
                    this.contentMapping.set(preparedContent, node.overrideContent);
                }

                this.phpTagDocs.set(node.overrideContent, node.sourceContent + 'KEEP');

                replaceIndex += 1;
            }
        });

        return results;
    }

    format(document: BladeDocument): Map<string, string> {
        const transformResults = this.transform(document);

        this.wasCached = false;
        if (this.cache.canCache(this.templateFile)) {
            if (this.cache.has(this.templateFile)) {
                try {
                    const restoredCache = this.cache.get(this.templateFile);

                    if (this.cache.isValid(restoredCache.contentMapping, this.contentMapping)) {
                        this.contentMapping = restoredCache.contentMapping;
                        this.resultMapping = restoredCache.resultMapping;

                        this.wasCached = true;

                        return this.resultMapping;
                    }
                } catch (err) {
                    // Prevent cache failure from crashing process.
                }
            }
        }

        const fSlug = StringUtilities.makeSlug(12), fileName = this.tmpDir + fSlug + '.php';
        fs.writeFileSync(fileName, transformResults, { encoding: 'utf8' });
        this.callLaravelPint(fileName, fSlug);

        const theRes = fs.readFileSync(fileName, { encoding: 'utf8' });
        fs.unlinkSync(fileName);
        this.cleanupFiles.forEach((fileName) => {
            fs.unlinkSync(fileName);
        });
        const tResL = StringUtilities.breakByNewLine(theRes);

        let curBuffer: string[] = [],
            checkEnd = this.markerSuffix,
            curIndex = -1,
            activeType = '';

        tResL.forEach((line) => {
            if (line.endsWith(checkEnd)) {
                var lIndex = parseInt(line.substring(0, line.indexOf('='))),
                    type = line.substring(line.indexOf('=') + 1, line.indexOf('=') + 4);

                if (activeType == '') {
                    activeType = type;
                }

                if (curIndex == -1) {
                    curIndex = lIndex;
                    return;
                } else {
                    this.resultMapping.set('__pint' + curIndex.toString(), this.cleanPintOutput(curBuffer.join("\n"), activeType));
                    curBuffer = [];
                    curIndex = lIndex;
                    activeType = type;
                    return;
                }
            }

            curBuffer.push(line);
        });

        if (curBuffer.length > 0) {
            this.resultMapping.set('__pint' + curIndex.toString(), this.cleanPintOutput(curBuffer.join("\n"), activeType));
            curBuffer = [];
            curIndex = -1;
        }

        if (this.cache.canCache(this.templateFile)) {
            this.cache.put(this.templateFile, this.resultMapping, this.contentMapping);
        }

        return this.resultMapping;
    }

    private cleanPintOutput(result: string, type: string): string {
        let tResult = result;

        if (type == 'DIR') {
            result = result.trim();
            tResult = result.substring(5).trimLeft();
            tResult = tResult.substring(0, tResult.length - 2).trimRight();
            tResult = tResult.substring(7).trimLeft();
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'PHP') {
            result = result.trim();
            tResult = result.substring(5).trimLeft();
            tResult = tResult.trimRight();
            tResult = tResult.substring(0, tResult.length - 2).trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'IPD') {
            result = result.trim();
            tResult = result.substring(5).trimLeft();
            tResult = tResult.trimRight().substring(0, tResult.length - 2).trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'FRL') {
            tResult = result.substring(5).trimLeft();
            tResult = tResult.trimLeft().substring(8).trimLeft().substring(1).trimLeft();
            tResult = tResult.trimRight();
            tResult = tResult.substring(0, tResult.length - 2).trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
            tResult = tResult.substring(0, tResult.length - 1).trimRight();
            tResult = tResult.substring(0, tResult.length - 1).trimRight();
            tResult = tResult.substring(0, tResult.length - 1).trimRight();
        } else if (type == 'ECH') {
            result = result.trim();
            tResult = result.substring(5).trimLeft();
            tResult = tResult.substring(4).trimLeft();
            tResult = tResult.trimRight();
            tResult = tResult.substring(0, tResult.length - 2).trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'BHP') {
            tResult = result.trim();
        }

        return tResult;
    }

    private callLaravelPint(fileName: string, fileSlug: string) {
        if (this.wasCached) {
            return;
        }

        const command = this.pintCommand.replace('{file}', `"${fileName}"`),
            baseFileName = path.basename(fileName);

        let output = '';

        if (this.phpDocs.size > 0 || this.phpTagDocs.size > 0) {
            this.phpDocs.forEach((doc, key) => {
                const docFname = this.tmpDir + fileSlug + 'php_' + key + '.php',
                    phpCommand = this.pintCommand.replace('{file}', `"${docFname}"`);
                fs.writeFileSync(docFname, doc, { encoding: 'utf8' });
                this.cleanupFiles.push(docFname);
            });

            this.phpTagDocs.forEach((doc, key) => {
                const docFname = this.tmpDir + fileSlug + 'tag_php_' + key + '.php',
                    phpCommand = this.pintCommand.replace('{file}', `"${docFname}"`);
                fs.writeFileSync(docFname, doc, { encoding: 'utf8' });
                this.cleanupFiles.push(docFname);
            });

            const dirCommand = this.pintCommand.replace('{file}', this.tmpDir);
            output = execSync(dirCommand).toString();

            this.phpDocs.forEach((doc, key) => {
                const docFname = this.tmpDir + fileSlug + 'php_' + key + '.php';
                const phpDocRes = fs.readFileSync(docFname, { encoding: 'utf8' });
                const fResults = phpDocRes.trim().substring(5);
                this.resultMapping.set(key, fResults);
            });

            this.phpTagDocs.forEach((doc, key) => {
                const docFname = this.tmpDir + fileSlug + 'tag_php_' + key + '.php';
                const phpDocRes = fs.readFileSync(docFname, { encoding: 'utf8' });
                let fResults = phpDocRes.trim();
                fResults = fResults.substring(0, fResults.length - 4);
                this.resultMapping.set(key, fResults);
            });
        } else {
            output = execSync(command).toString();
        }

        /*
        this.phpDocs.forEach((doc, key) => {
            const docFname = this.tmpDir + fileSlug + 'php_' + key + '.php',
                phpCommand = this.pintCommand.replace('{file}', `"${docFname}"`);
            fs.writeFileSync(docFname, doc, { encoding: 'utf8' });
            const fsOut = execSync(phpCommand).toString();

            if (this.outputPintResults) {
                console.log(fsOut);
            }

            const phpDocRes = fs.readFileSync(docFname, { encoding: 'utf8' });
            const fResults = phpDocRes.trim().substring(5);
            this.resultMapping.set(key, fResults);
        });

        this.phpTagDocs.forEach((doc, key) => {
            const docFname = this.tmpDir + fileSlug + 'tag_php_' + key + '.php',
                phpCommand = this.pintCommand.replace('{file}', `"${docFname}"`);
            fs.writeFileSync(docFname, doc, { encoding: 'utf8' });
            const fsOut = execSync(phpCommand).toString();

            if (this.outputPintResults) {
                console.log(fsOut);
            }

            const phpDocRes = fs.readFileSync(docFname, { encoding: 'utf8' });
            const fResults = phpDocRes.trim().substring(5);
            this.resultMapping.set(key, fResults);
        });
        */

        if (this.outputPintResults && typeof this.templateFile !== 'undefined' && this.templateFile != null) {
            if (output.includes(baseFileName)) {
                const tempOutput = StringUtilities.breakByNewLine(output),
                    newLines: string[] = [];

                for (let i = 0; i < tempOutput.length; i++) {
                    let line = tempOutput[i].trim();

                    if (line.length == 0 || line == '✓') {
                        continue;
                    }

                    if (line.startsWith('✓')) {
                        line = line.substring(1).trim();
                    }

                    if (line.includes(baseFileName)) {
                        line = path.basename(this.templateFile) + line.substring(line.indexOf(baseFileName) + baseFileName.length);
                    }

                    newLines.push(line);
                }

                console.log(newLines.join("\n"));
            }
        }
    }
}