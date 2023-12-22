import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { BladeComponentNode, BladeEchoNode, DirectiveNode, InlinePhpNode, ParameterNode, ParameterType } from '../nodes/nodes.js';
import { BladeDocument } from './bladeDocument.js';
import { StringUtilities } from '../utilities/stringUtilities.js';
import { PintCache } from './pintCache.js';

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
    private pintConfigPath = '';
    private static processConfigPath: string | null = null;
    private phpDocs: Map<string, string> = new Map();
    private phpTagDocs: Map<string, string> = new Map();
    private cleanupFiles: string[] = [];
    private cleanupDirs: string[] = [];
    private didFail: boolean = false;
    private defaultConfig: object = {
        "preset": "laravel",
        "rules": {
            "concat_space": {
                "spacing": "none"
            },
            "no_unused_imports": false,
            "declare_strict_types": false,
            "method_argument_space": true,
            "single_trait_insert_per_statement": true,
            "types_spaces": {
                "space": "single"
            }
        }
    };

    constructor(tmpFilePath: string, cacheDir: string, pintCommand: string, pintConfigurationPath: string) {
        this.tmpDir = tmpFilePath;
        this.cacheDir = cacheDir;

        this.pintConfigPath = pintConfigurationPath;
        this.markerSuffix = this.markerSuffix + StringUtilities.makeSlug(27);

        const internalConfigPath = this.tmpDir + '/pint.json';

        if (PintTransformer.processConfigPath == null) {
            if (this.pintConfigPath.trim().length == 0 || !fs.existsSync(this.pintConfigPath)) {
                // Need to write a default config.
                fs.writeFileSync(internalConfigPath, JSON.stringify(this.defaultConfig), { encoding: 'utf8' });
                PintTransformer.processConfigPath = internalConfigPath;
            } else {
                try {
                    const existingConfig = JSON.parse(fs.readFileSync(this.pintConfigPath, { encoding: 'utf8' }));
                    if (typeof existingConfig.rules !== 'undefined') {
                        // We won't have everything available all the time, so need to set this.
                        existingConfig.rules.no_unused_imports = false;
                        existingConfig.rules.declare_strict_types = false;
                    } else {
                        existingConfig.rules = {
                            no_unused_imports: false,
                            declare_strict_types: false,
                        };
                    }

                    fs.writeFileSync(internalConfigPath, JSON.stringify(existingConfig), { encoding: 'utf8' });
                    PintTransformer.processConfigPath = internalConfigPath;
                } catch (err) {
                    // Need to write a default config.
                    fs.writeFileSync(internalConfigPath, JSON.stringify(this.defaultConfig), { encoding: 'utf8' });
                    PintTransformer.processConfigPath = internalConfigPath;
                }
            }
        }

        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir);
        }

        this.cache = new PintCache(this.cacheDir);

        if (!fs.existsSync(this.tmpDir)) {
            fs.mkdirSync(this.tmpDir);
        }

        this.pintCommand = pintCommand;
    }

    getDidFail(): boolean {
        return this.didFail;
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
        let preparedPhpContent = this.prepareContent(php.sourceContent);
        if (this.contentMapping.has(preparedPhpContent)) {
            const originalIndex = this.contentMapping.get(preparedPhpContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        preparedPhpContent = this.prepareContent(php.sourceContent.trim());
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
        let preparedEchoContent = this.prepareContent(echo.content);
        if (this.contentMapping.has(preparedEchoContent)) {
            const originalIndex = this.contentMapping.get(preparedEchoContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        preparedEchoContent = this.prepareContent(echo.content.trim());
        if (this.contentMapping.has(preparedEchoContent)) {
            const originalIndex = this.contentMapping.get(preparedEchoContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        return echo.content;
    }

    getComponentParameterContent(parameter: ParameterNode): string {
        if (parameter.overrideValue != null && this.resultMapping.has(parameter.overrideValue)) {
            const insertContent = this.resultMapping.get(parameter.overrideValue) as string

            if (insertContent.includes("\n")) {
                return `${parameter.name}="\n${insertContent}\n"`;
            } else {
                return parameter.name + '="' + insertContent.trim() + '"';
            }
        }

        let preparedValue = this.prepareContent(parameter.value);
        if (this.contentMapping.has(preparedValue)) {
            const originalIndex = this.contentMapping.get(preparedValue) as string;

            if (this.resultMapping.has(originalIndex)) {
                const insertContent = this.resultMapping.get(originalIndex) as string;

                if (insertContent.includes("\n")) {
                    return `${parameter.name}="\n${insertContent}\n"`;
                } else {
                    return parameter.name + '="' + insertContent.trim() + '"';
                }
            }
        }

        preparedValue = this.prepareContent(parameter.value.trim());
        if (this.contentMapping.has(preparedValue)) {
            const originalIndex = this.contentMapping.get(preparedValue) as string;

            if (this.resultMapping.has(originalIndex)) {
                const insertContent = this.resultMapping.get(originalIndex) as string;

                if (insertContent.includes("\n")) {
                    return `${parameter.name}="\n${insertContent}\n"`;
                } else {
                    return parameter.name + '="' + insertContent.trim() + '"';
                }
            }
        }

        return parameter.content;
    }

    getDirectiveContent(directive: DirectiveNode): string {
        if (directive.overrideParams != null && this.resultMapping.has(directive.overrideParams)) {
            return '(' + this.resultMapping.get(directive.overrideParams) as string + ')';
        }

        // Handle the case of nested child documents having different index values.
        let preparedParams = this.prepareContent(directive.directiveParameters);
        if (this.contentMapping.has(preparedParams)) {
            const originalIndex = this.contentMapping.get(preparedParams) as string;

            if (this.resultMapping.has(originalIndex)) {
                return '(' + this.resultMapping.get(originalIndex) as string + ')';
            }
        }

        preparedParams = this.prepareContent(directive.directiveParameters.trim());
        if (this.contentMapping.has(preparedParams)) {
            const originalIndex = this.contentMapping.get(preparedParams) as string;

            if (this.resultMapping.has(originalIndex)) {
                return '(' + this.resultMapping.get(originalIndex) as string + ')';
            }
        }

        return directive.directiveParameters;
    }

    getDirectivePhpContent(directive: DirectiveNode): string {

        if (directive.overrideParams != null && this.resultMapping.has(directive.overrideParams)) {
            return this.resultMapping.get(directive.overrideParams) as string;
        }

        // Handle the case of nested child documents having different index values.
        let preparedContent = this.prepareContent(directive.documentContent);
        if (this.contentMapping.has(preparedContent)) {
            const originalIndex = this.contentMapping.get(preparedContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        preparedContent = this.prepareContent(directive.documentContent.trim());
        if (this.contentMapping.has(preparedContent)) {
            const originalIndex = this.contentMapping.get(preparedContent) as string;

            if (this.resultMapping.has(originalIndex)) {
                return this.resultMapping.get(originalIndex) as string;
            }
        }

        return directive.documentContent;
    }

    transform(document: BladeDocument): string | null {
        let results = '<?php ' + "\n",
            replaceIndex = 0,
            itemsInOutput = 0;

        document.getAllNodes().forEach((node) => {
            if (node instanceof DirectiveNode) {
                if (node.directiveName == 'php' && node.isClosedBy != null && node.hasValidPhp()) {
                    const candidate = node.documentContent.trim();

                    if (candidate.length == 0) { return; }

                    itemsInOutput += 1;

                    let phpDoc = '';

                    phpDoc += '<?php ' + "\n";
                    phpDoc += node.documentContent;
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

                            itemsInOutput += 1;

                            results += '// ' + replaceIndex.toString() + '=IPD' + this.markerSuffix;
                            results += "\n";

                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            });

                            results = results.trimRight();
                            results += ';';
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

                            itemsInOutput += 1;

                            results += '// ' + replaceIndex.toString() + '=FRL' + this.markerSuffix;
                            results += "\n";
                            results += 'foreach(';

                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            });

                            results += ') {}';
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

                            itemsInOutput += 1;

                            results += '// ' + replaceIndex.toString() + '=DIR' + this.markerSuffix;
                            results += "\n";
                            results += '$tVar = ';

                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine.trimLeft() + "\n";
                            });

                            results += ';';
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

                itemsInOutput += 1;

                results += '// ' + replaceIndex.toString() + '=ECH' + this.markerSuffix;
                results += "\n";
                results += 'echo ';

                StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                    results += cLine.trimLeft() + "\n";
                });

                results = results.trimRight();
                results += ';';
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

                            itemsInOutput += 1;

                            results += '// ' + replaceIndex.toString() + '=DIR' + this.markerSuffix;
                            results += "\n";
                            results += '$tVar = ';

                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine + "\n";
                            });

                            results += ';';
                            results += "\n";
                            param.directive.overrideParams = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(param.directive.directiveParameters);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, param.directive.overrideParams);
                            }

                            replaceIndex += 1;
                        } else if (param.type == ParameterType.InlineEcho && param.inlineEcho != null && param.inlineEcho.hasValidPhp()) {
                            itemsInOutput += 1;

                            const candidate = param.inlineEcho.content.trim();
                            results += '// ' + replaceIndex.toString() + '=ECH' + this.markerSuffix;
                            results += "\n";
                            results += 'echo ';

                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine + "\n";
                            });

                            results = results.trimRight();
                            results += ';';
                            results += "\n";
                            param.inlineEcho.overrideContent = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(param.inlineEcho.content);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, param.inlineEcho.overrideContent);
                            }

                            replaceIndex += 1;
                        } else if (param.isExpression && !param.isEscapedExpression && param.hasValidPhpExpression()) {
                            itemsInOutput += 1;

                            const candidate = param.value.trim();
                            results += '// ' + replaceIndex.toString() + '=CPV' + this.markerSuffix;
                            results += "\n";
                            results += 'echo ';

                            StringUtilities.breakByNewLine(candidate).forEach((cLine) => {
                                results += cLine + "\n";
                            });

                            results = results.trimRight();
                            results += ';';
                            results += "\n";
                            param.overrideValue = '__pint' + replaceIndex.toString();

                            const preparedParameters = this.prepareContent(param.value);
                            if (!this.contentMapping.has(preparedParameters)) {
                                this.contentMapping.set(preparedParameters, param.overrideValue);
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

                itemsInOutput += 1;

                node.overrideContent = '__pint' + replaceIndex.toString();

                const preparedContent = this.prepareContent(node.sourceContent);
                if (!this.contentMapping.has(preparedContent)) {
                    this.contentMapping.set(preparedContent, node.overrideContent);
                }

                this.phpTagDocs.set(node.overrideContent, node.sourceContent + 'KEEP');

                replaceIndex += 1;
            }
        });

        if (itemsInOutput == 0) {
            return null;
        }

        return results;
    }

    format(document: BladeDocument): Map<string, string> {
        const transformResults = this.transform(document);

        if (transformResults == null) {
            return this.resultMapping;
        }

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

        let theRes = '';

        try {
            theRes = this.callLaravelPint(transformResults);
        } catch (err) {
            this.didFail = true;

            this.cleanupFiles.forEach((fileName) => {
                fs.unlinkSync(fileName);
            });
            this.cleanupDirs.forEach((dirName) => {
                fs.rmdirSync(dirName, { recursive: true });
            });

            if (this.outputPintResults) {
                console.error(err);
            }

            return this.resultMapping;
        }

        this.cleanupFiles.forEach((fileName) => {
            fs.unlinkSync(fileName);
        });
        const tResL = StringUtilities.breakByNewLine(theRes);

        let curBuffer: string[] = [],
            checkEnd = this.markerSuffix,
            curIndex = -1,
            activeType = '',
            hasObservedMarker = false;

        tResL.forEach((line) => {
            if (line.endsWith(checkEnd)) {
                hasObservedMarker = true;
                var lIndex = parseInt(line.substring(2).trim().substring(0, line.indexOf('='))),
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

            if (hasObservedMarker) {
                curBuffer.push(line);
            }
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
            tResult = tResult.trim().trimRight();
            tResult = tResult.substring(7).trimLeft();
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'PHP') {
            tResult = result.trim().substring(5).trimLeft();
            tResult = tResult.trimRight();
            tResult = tResult.trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'IPD') {
            tResult = result.trim().trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'FRL') {
            tResult = tResult.trimLeft().substring(8).trimLeft().substring(1).trimLeft();
            tResult = tResult.trimRight();
            tResult = tResult.trimRight();
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
            tResult = result.trim();
            tResult = tResult.substring(4).trimLeft();
            tResult = tResult.trimRight();
            tResult = tResult.trimRight();
            if (tResult.endsWith('?')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
            if (tResult.endsWith(';')) {
                tResult = tResult.substring(0, tResult.length - 1).trimRight()
            }
        } else if (type == 'CPV') {
            tResult = result.trim();
            tResult = tResult.substring(4).trimLeft();
            tResult = tResult.trimRight();
            tResult = tResult.trimRight();
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

    private callLaravelPint(transformResults: string): string {
        if (this.wasCached) {
            return '';
        }

        const fileSlug = StringUtilities.makeSlug(26);

        let baseFileName = '',
            output = '',
            pintResults = '';

        if (this.phpDocs.size > 0 || this.phpTagDocs.size > 0) {
            // Create a temp directory to work inside.
            const tmpDir = this.tmpDir + '/' + StringUtilities.makeSlug(32) + '/';
            fs.mkdirSync(tmpDir);

            const fileName = tmpDir + fileSlug + '.php';
            fs.writeFileSync(fileName, transformResults, { encoding: 'utf8' });

            this.cleanupFiles.push(fileName);
            this.cleanupDirs.push(tmpDir);
            this.phpDocs.forEach((doc, key) => {
                const docFname = tmpDir + fileSlug + 'php_' + key + '.php';
                fs.writeFileSync(docFname, doc, { encoding: 'utf8' });
                this.cleanupFiles.push(docFname);
            });

            this.phpTagDocs.forEach((doc, key) => {
                const docFname = tmpDir + fileSlug + 'tag_php_' + key + '.php';
                fs.writeFileSync(docFname, doc, { encoding: 'utf8' });
                this.cleanupFiles.push(docFname);
            });

            const dirCommand = this.pintCommand.replace('{file}', `"${tmpDir}"`) + ` --config "${PintTransformer.processConfigPath}"`;
            output = execSync(dirCommand).toString();

            this.phpDocs.forEach((doc, key) => {
                const docFname = tmpDir + fileSlug + 'php_' + key + '.php';
                const phpDocRes = fs.readFileSync(docFname, { encoding: 'utf8' });
                const fResults = phpDocRes.trim().substring(5);
                this.resultMapping.set(key, fResults);
            });

            this.phpTagDocs.forEach((doc, key) => {
                const docFname = tmpDir + fileSlug + 'tag_php_' + key + '.php';
                const phpDocRes = fs.readFileSync(docFname, { encoding: 'utf8' });
                let fResults = phpDocRes.trim();
                fResults = fResults.substring(0, fResults.length - 4);
                this.resultMapping.set(key, fResults);
            });

            pintResults = fs.readFileSync(fileName, { encoding: 'utf8' });
        } else {
            const fileName = this.tmpDir + fileSlug + '.php';
            fs.writeFileSync(fileName, transformResults, { encoding: 'utf8' });

            const command = this.pintCommand.replace('{file}', `"${fileName}"`) + ` --config "${PintTransformer.processConfigPath}"`;
            baseFileName = path.basename(fileName);

            try {
                output = execSync(command).toString();
                pintResults = fs.readFileSync(fileName, { encoding: 'utf8' });
            } catch (err) {
                throw err;
            } finally {
                this.cleanupFiles.push(fileName);
            }
        }

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

        return pintResults;
    }
}