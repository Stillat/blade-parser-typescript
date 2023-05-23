import { PhpOperatorReflow } from '../../formatting/phpOperatorReflow';
import { getEchoPhpOptions } from '../../formatting/prettier/utils';
import { SyntaxReflow } from '../../formatting/syntaxReflow';
import { BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode } from '../../nodes/nodes';
import { StringUtilities } from '../../utilities/stringUtilities';
import { PhpFormatter } from '../formatters';
import { TransformOptions } from '../transformOptions';
import { IndentLevel } from './indentLevel';
import { getPrintWidth } from './printWidthUtils';

export class EchoPrinter {
    static printEcho(echo: BladeEchoNode, formattingOptions:TransformOptions, phpFormatter: PhpFormatter | null, indentLevel: number): string {
        let start = '{{ ',
            end = ' }}';

        if (echo instanceof BladeEscapedEchoNode) {
            start = '{!! ';
            end = ' !!}';
        } else if (echo instanceof BladeEntitiesEchoNode) {
            start = '{{{ ';
            end = ' }}}';
        }

        let result = start;

        let innerContent = echo.content.trim();

        if (formattingOptions.formatInsideEcho) {
            if (phpFormatter != null && echo.hasValidPhp()) {
                let echoOptions = getEchoPhpOptions(),
                    tResult = innerContent;

                if (echo.startPosition?.line != echo.endPosition?.line) {
                    echoOptions = {
                        ...echoOptions,
                        printWidth: getPrintWidth(innerContent, echoOptions.printWidth)
                    };
                    
                    const lineWrapWorkaround = preparePrettierWorkaround(innerContent);

                    if (lineWrapWorkaround.addedHack) {
                        innerContent = lineWrapWorkaround.content;
                    }

                    tResult = phpFormatter('<?php ' + innerContent, formattingOptions, echoOptions);

                    if (lineWrapWorkaround.addedHack) {
                        tResult = undoPrettierWorkaround(tResult);
                    }
    
                    if (PhpOperatorReflow.couldReflow(tResult)) {
                        tResult = PhpOperatorReflow.instance.reflow(tResult);
                    }

                    if (SyntaxReflow.couldReflow(tResult)) {
                        tResult = SyntaxReflow.instance.reflow(tResult);
                    }

                    if (formattingOptions.echoStyle == 'inline') {

                        const inlineIndentResult = IndentLevel.shiftIndentWithLastLineInline(
                            tResult,
                            formattingOptions.tabSize,
                            indentLevel + formattingOptions.tabSize,
                            true
                        ).trim();

                        const inlineRelativeIndent = start.trimRight() + ' ' + inlineIndentResult  + ' ' + end.trim();
    
                        return inlineRelativeIndent;
                    }

                    const relativeIndent = start.trim() + "\n" + IndentLevel.shiftIndent(
                        tResult,
                        indentLevel + formattingOptions.tabSize,
                        false
                    ) + "\n" + ' '.repeat(indentLevel) + end.trim();

                    return relativeIndent;
                } else {
                    tResult = phpFormatter('<?php ' + innerContent +';', formattingOptions, {...echoOptions, printWidth: Infinity});
                    tResult = tResult.trimRight().substring(0, tResult.trimRight().length - 1);
                    if (PhpOperatorReflow.couldReflow(tResult)) {
                        tResult = PhpOperatorReflow.instance.reflow(tResult);
                    }

                    if (SyntaxReflow.couldReflow(tResult)) {
                        tResult = SyntaxReflow.instance.reflow(tResult);
                    }

                    // Handle the case if prettier added newlines anyway.
                    if (tResult.includes("\n")) {
                       tResult = StringUtilities.collapse(tResult);
                    }
                }

                innerContent = tResult;
            }
        }        

        result += innerContent + end;

        return result;
    }
}

function undoPrettierWorkaround(content:string): string {
    const lines = StringUtilities.breakByNewLine(content),
        newContent:string[] = [];

    let alreadyReversed = false;

    for (let i = 0; i < lines.length;i++){ 
        const line = lines[i];

        if (line.trimRight().endsWith('//') && !alreadyReversed) {
            newContent.push(line.trimRight().substring(0, line.trimRight().length - 2).trimRight());
            alreadyReversed = true;
            continue;
        }

        newContent.push(line);
    }

    return newContent.join("\n");
}

function preparePrettierWorkaround(content:string): ILineWorkAroundResult {
    const lines = StringUtilities.breakByNewLine(content);
    let newContent:string[] = [],
        addedHack = false,
        addHack = false,
        doContinue = true;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (!addedHack && line.trimRight().endsWith('[')) {
            addHack = true;
            newContent.push(line);
            continue;
        }

        if (line.trimRight().endsWith(',') && addHack && !addedHack) {
            if (line.trimRight().endsWith('//')) {
                doContinue = false;
                break;
            } else {
                newContent.push(line + '//');
                addedHack = true;
            }
        } else {
            newContent.push(line);
        }
    }

    if (!doContinue) {
        return {
            content: content,
            addedHack: false
        };
    }
    
    return {
        content: newContent.join("\n"),
        addedHack: addedHack
    };
}

interface ILineWorkAroundResult {
    content:string,
    addedHack: boolean
}