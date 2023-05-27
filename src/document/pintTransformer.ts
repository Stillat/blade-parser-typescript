import * as fs from 'fs';
const { execSync } = require('child_process');
import { BladeComponentNode, BladeEchoNode, DirectiveNode, ParameterType } from '../nodes/nodes';
import { BladeDocument } from './bladeDocument';
import { StringUtilities } from '../utilities/stringUtilities';
import { Parameter } from 'php-parser';

export class PintTransformer {
    private file: string = '';
    private resultMapping: Map<string, string> = new Map();
    private contentMapping: Map<string, string> = new Map();

    constructor(tmpFilePath: string, pintLocation: string) {
        this.file = tmpFilePath;
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
                if (node.directiveName == 'php' && node.isClosedBy != null) {
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
                    if (node.hasDirectiveParameters && !node.hasJsonParameters) {
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
            } else if (node instanceof BladeEchoNode) {
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
                        if (param.type == ParameterType.Directive && param.directive != null) {
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
                        } else if (param.type == ParameterType.InlineEcho && param.inlineEcho != null) {
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
            }
        });

        return results;
    }

    format(document: BladeDocument): Map<string, string> {
        const transformResults = this.transform(document);
        fs.writeFileSync(this.file, transformResults, { encoding: 'utf8' });
        this.callLaravelPint(this.file);

        const theRes = fs.readFileSync(this.file, { encoding: 'utf8' });
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
        }

        /*if (tResult.startsWith('[') && tResult.endsWith(']')) {
            const lineRes = StringUtilities.breakByNewLine(tResult);
            let nTResult = '';

            for (let i = 0; i < lineRes.length; i++) {
                if (i ==0 || i == lineRes.length - 1) {
                    nTResult += lineRes[i] + "\n";
                } else {
                    nTResult += ' '.repeat(this.tabSize) + lineRes[i] + "\n";
                }
            }

            tResult = nTResult;
        }*/

        return tResult;
    }

    private callLaravelPint(fileName: string) {
        const conf = __dirname + '/../../pint.json';
        const command = `pint ${fileName}`;
        try {
            execSync(command, { stdio: 'pipe' });
        } catch (e: unknown) {
            let ee = e as any;
            if (typeof ee.stdout !== 'undefined') {
                const debugMsg = (ee.stdout).toString();
                console.error(debugMsg)
            } else {
                throw e;
            }
        }
    }
}