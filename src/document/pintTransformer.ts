import * as fs from 'fs';
import * as path from 'path';
const { execSync } = require('child_process');
import { BladeComponentNode, BladeEchoNode, DirectiveNode, InlinePhpNode, ParameterType } from '../nodes/nodes';
import { BladeDocument } from './bladeDocument';
import { StringUtilities } from '../utilities/stringUtilities';
import { PintCache } from './pintCache';

export class PintTransformer {
    private tmpDir: string = '';
    private cacheDir: string = '';
    private resultMapping: Map<string, string> = new Map();
    private contentMapping: Map<string, string> = new Map();
    private pintCommand: string = '';
    private templateFile: string = '';
    private cache: PintCache;
    private wasCached = false;

    constructor(tmpFilePath: string, cacheDir: string, pintCommand: string) {
        this.tmpDir = tmpFilePath;
        this.cacheDir = cacheDir;

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

    private makeSlug(length: number): string {
        if (length <= 2) {
            length = 7;
        }

        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            charactersLength = characters.length;

        for (let i = 0; i < length - 1; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }

        const slug = 'B' + result + 'B';

        return slug;
    }

    private prepareContent(input: string): string {
        const whitespacePattern = /\s/g; // Matches all whitespace characters
        const quotePattern = /['"`]/g; // Matches single quotes, double quotes, and backticks

        // Remove whitespace characters
        let result = input.replace(whitespacePattern, '');

        // Remove quotes
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
                    results += replaceIndex.toString() + '=PHP' + '='.repeat(32);
                    results += "\n";
                    results += '<?php ';
                    StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                        results += cLine.trimLeft() + "\n";
                    })
                    results += '; ?>';
                    results += "\n";
                    node.overrideParams = '__pint' + replaceIndex.toString();

                    const preparedContent = this.prepareContent(node.documentContent);
                    if (!this.contentMapping.has(preparedContent)) {
                        this.contentMapping.set(preparedContent, node.overrideParams);
                    }

                    replaceIndex += 1;
                } else {
                    if (node.hasDirectiveParameters && !node.hasJsonParameters && node.hasValidPhp()) {
                        if (node.directiveName == 'php') {
                            const candidate = node.directiveParameters.substring(1, node.directiveParameters.length - 1).trim();
                            results += replaceIndex.toString() + '=IPD' + '='.repeat(32);
                            results += "\n";
                            results += '<?php ';
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
                        } else if (node.directiveName == 'forelse' || node.directiveName == 'foreach') {
                            const candidate = node.directiveParameters.substring(1, node.directiveParameters.length - 1).trim();
                            results += replaceIndex.toString() + '=FRL' + '='.repeat(32);
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
                            results += replaceIndex.toString() + '=DIR' + '='.repeat(32);
                            results += "\n";
                            results += '<?php $tVar = pintFn(';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            })
                            results += '); ?>';
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
                results += replaceIndex.toString() + '=ECH' + '='.repeat(32);
                results += "\n";
                results += '<?php ';
                StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                    results += cLine.trimLeft() + "\n";
                })
                results += ' ?>';
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
                            results += replaceIndex.toString() + '=DIR' + '='.repeat(32);
                            results += "\n";
                            results += '<?php $tVar = pintFn(';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            })
                            results += '); ?>';
                            results += "\n";
                            param.directive.overrideParams = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(param.directive.directiveParameters);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, param.directive.overrideParams);
                            }

                            replaceIndex += 1;
                        } else if (param.type == ParameterType.InlineEcho && param.inlineEcho != null && param.inlineEcho.hasValidPhp()) {
                            const candidate = param.inlineEcho.content.trim();
                            results += replaceIndex.toString() + '=ECH' + '='.repeat(32);
                            results += "\n";
                            results += '<?php ';
                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            })
                            results += ' ?>';
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
                results += replaceIndex.toString() + '=BHP' + '='.repeat(32);
                results += "\n";

                StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                    results += cLine.trimLeft() + "\n";
                })

                results += "\n";
                node.overrideContent = '__pint' + replaceIndex.toString();

                const preparedContent = this.prepareContent(node.sourceContent);
                if (!this.contentMapping.has(preparedContent)) {
                    this.contentMapping.set(preparedContent, node.overrideContent);
                }

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

        const fileName = this.tmpDir + this.makeSlug(12) + '.php';
        fs.writeFileSync(fileName, transformResults, { encoding: 'utf8' });
        this.callLaravelPint(fileName);

        const theRes = fs.readFileSync(fileName, { encoding: 'utf8' });
        fs.unlink(fileName, () => { });
        const tResL = StringUtilities.breakByNewLine(theRes);

        let curBuffer: string[] = [],
            checkEnd = '='.repeat(32),
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
            tResult = result.substring(5).trimLeft().substring(5).trimLeft().substring(1).trimLeft();
            tResult = tResult.substring(0, tResult.length - 2).trimRight();
            tResult = tResult.substring(0, tResult.length - 1).trimRight()
            tResult = tResult.substring(7).trimLeft();
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
            if (tResult.endsWith(')')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight();
            }
        } else if (type == 'PHP') {
            tResult = result.substring(5).trimLeft();
            tResult = tResult.trimRight().substring(0, tResult.length - 2).trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'IPD') {
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
            tResult = tResult.trimRight().substring(0, tResult.length - 2).trimRight();
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
            tResult = result.substring(5).trimLeft();
            tResult = tResult.trimRight().substring(0, tResult.length - 2).trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'BHP') {
            tResult = result.trim();
        }

        return tResult;
    }

    private callLaravelPint(fileName: string) {
        if (this.wasCached) {
            return;
        }


        const command = this.pintCommand.replace('{file}', `"${fileName}"`),
            baseFileName = path.basename(fileName),
            output = execSync(command).toString();

        if (typeof this.templateFile !== 'undefined' && this.templateFile != null) {
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