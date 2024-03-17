import { StringUtilities } from '../../utilities/stringUtilities.js';
import { TransformOptions } from '../transformOptions.js';

export class IndentLevel {
    static relativeIndentLevel(value: string, content: string): number {
        const tempStructureLines = StringUtilities.breakByNewLine(content);

        for (let i = 0; i < tempStructureLines.length; i++) {
            const thisLine = tempStructureLines[i];

            if (thisLine.includes(value)) {
                const trimmed = thisLine.trimLeft();

                return thisLine.length - trimmed.length;
            }
        }
        return 0;
    }

    static indentLast(value: string, indent: number, tabSize: number) {
        const replace = ' '.repeat(indent),
            lines: string[] = StringUtilities.breakByNewLine(value),
            newLines: string[] = [];

        if (lines.length == 3) {
            newLines.push(lines[0]);
            newLines.push(replace + ' '.repeat(tabSize) + lines[1].trim());
            newLines.push(replace + lines[2]);

            return newLines.join("\n");
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (i == 0) {
                newLines.push(line);
            } else {
                if (i == lines.length - 1) {
                    newLines.push(replace + line);
                } else {
                    if (line.includes('=') || (line.trim().includes(' ') == false && !line.trimLeft().startsWith('@'))) {
                        newLines.push(replace + ' '.repeat(tabSize) + line.trimLeft());
                    } else {
                        newLines.push(replace + line);
                    }
                }
            }
        }

        return newLines.join("\n");
    }

    static indentRelative(value: string, targetIndent: number, tabSize: number): string {
        const sourceLines: string[] = StringUtilities.breakByNewLine(value);
        let reflowedLines: string[] = [];

        // Clean up leading new lines.
        for (let i = 0; i < sourceLines.length; i++) {
            const thisLine = sourceLines[i];

            if (thisLine.trim().length > 0) {
                reflowedLines = sourceLines.slice(i);
                break;
            }
        }

        // Clean up trailing whitespace.
        for (let i = reflowedLines.length - 1; i >= 0; i--) {
            const thisLine = reflowedLines[i];

            if (thisLine.trim().length == 0) {
                reflowedLines.pop();
            } else {
                break;
            }
        }

        let leastIndentChange = -1;
        let thatLine = '';
        // Find which line currently has the least amount of left whitespace.
        for (let i = 0; i < reflowedLines.length; i++) {
            const thisLine = reflowedLines[i],
                checkLine = thisLine.trimLeft(),
                wsDiff = thisLine.length - checkLine.length;

            if (thisLine.trim().length == 0) {
                continue;
            }

            if (i == 0) {
                leastIndentChange = wsDiff;
                thatLine = thisLine;
            } else {
                if (wsDiff < leastIndentChange) {
                    leastIndentChange = wsDiff;
                    thatLine = thisLine;
                }
            }
        }

        if (leastIndentChange == tabSize) {
            leastIndentChange = 0;
        }

        // Remove the discovered leading whitespace and then apply our new (relative) indent level.
        if (leastIndentChange >= 0) {
            const targetWs = ' '.repeat(targetIndent);

            for (let i = 0; i < reflowedLines.length; i++) {
                const thisLine = reflowedLines[i];

                if (thisLine.trim().length == 0) { reflowedLines[i] = ''; continue; }
                const reflowed = thisLine.substring(leastIndentChange);

                if (i == 0) {
                    reflowedLines[i] = thisLine.trimLeft();
                    continue;
                } else {
                    reflowedLines[i] = targetWs + reflowed;
                }
            }
        }

        return reflowedLines.join("\n");
    }


    static shiftIndentWithLastLineInline(value: string, tabSize: number, targetIndent: number, skipFirst: boolean = false): string {
        const lines = StringUtilities.breakByNewLine(value.trim()),
            reflowedLines: string[] = [];

        if (lines.length > 1) {
            let isAlreadyIndentedRelative = true;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i],
                    diff = line.length - line.trim().length,
                    iDiff = targetIndent - diff;

                if (iDiff != 0) {
                    isAlreadyIndentedRelative = false;
                    break;
                }
            }

            if (isAlreadyIndentedRelative) {
                return value.trim();
            }
        }

        for (let i = 0; i < lines.length; i++) {
            if (i == 0 && skipFirst) { reflowedLines.push(lines[i]); continue; }
            const line = lines[i];

            if (line.trim().length == 0) {
                reflowedLines.push('');
            } else {
                reflowedLines.push(' '.repeat(Math.max(0, targetIndent - tabSize)) + line);
            }
        }

        return reflowedLines.join("\n");
    }

    static shiftHtmlAttributeContent(value: string, targetIndent: number, tabSize: number): string {
        const lines = StringUtilities.breakByNewLine(value.trim()),
            reflowed: string[] = [];

        for (let i = 0 ; i < lines.length; i++) {
            const line = lines[i];

            if (i == 0) {
                if (targetIndent == tabSize) {
                    reflowed.push(' '.repeat(targetIndent) + line.trimLeft());
                    continue;
                }
                reflowed.push(' '.repeat(targetIndent - 2 * tabSize) + line.trimLeft());
                continue;
            }

            if (i == lines.length - 1) {
                reflowed.push(' '.repeat(targetIndent) + line.trimLeft());
                continue;
            }

            reflowed.push(' '.repeat(targetIndent) + line);
        }

        return reflowed.join("\n");
    }

    static shiftParameterContent(value: string, targetIndent: number, tabSize: number): string {
        const lines = StringUtilities.breakByNewLine(value.trim()),
            reflowed: string[] = [];

        for (let i = 0 ; i < lines.length; i++) {
            const line = lines[i];

            if (i == 0) {
                reflowed.push(line);
                continue;
            }

            if (i == lines.length - 1 && line.trim() == '"') {
                reflowed.push(' '.repeat(targetIndent) + line.trimLeft());
                continue;
            }

            const lDiff = line.length - line.trimLeft().length;

            if (lDiff == tabSize) {
                reflowed.push(' '.repeat(targetIndent + tabSize * 2) + line.trimLeft());
            } else {
                reflowed.push(' '.repeat(tabSize + targetIndent) + line.trimLeft());
            }
        }

        return reflowed.join("\n");
    }

    static removeLeadingWhitespace(value: string, tabSize: number, usingPint: boolean): string {
        const lines = StringUtilities.breakByNewLine(value.trim()),
            trimmedLines: string[] = [];
        let minWhitespace = -1,
            contentLinesAreTabSize = true,
            areAllContentIndentationsTheSame = true,
            tabSizes:number[] = [];

        if (lines.length > 0) {
            if (lines[lines.length - 1].trim() == '"') {
                lines[lines.length - 1] = '"';
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (i == 0) {
                continue;
            }

            if (line.trim().length == 0) {
                continue;
            }

            const wsDiff = line.length - line.trimLeft().length;

            if (i < lines.length - 1) {
                if (wsDiff != tabSize) {
                    if (tabSizes.length > 0) {
                        if (tabSizes.includes(wsDiff) == false) {
                            areAllContentIndentationsTheSame = false;
                        }
                    } else {
                        tabSizes.push(wsDiff);
                    }
                    contentLinesAreTabSize = false;
                }
            }

            if (minWhitespace < 0 && wsDiff > 0) {
                minWhitespace = wsDiff;
                continue;
            }

            if (wsDiff > 0 && wsDiff < minWhitespace) {
                minWhitespace = wsDiff;
            }
        }

        if (minWhitespace <= 0) {
            return value;
        }

        // We don't want to do this for Pint output as its leading whitespace will already be handled.
        if (! usingPint) {
            if (! contentLinesAreTabSize && areAllContentIndentationsTheSame && tabSizes.length > 0) {
                if (tabSizes[0] % tabSize === 0) {
                    contentLinesAreTabSize = true;
                }
            }
    
            if (contentLinesAreTabSize) {
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
    
                    if (i == 0 || i == lines.length - 1) {
                        if (minWhitespace > tabSize && i == lines.length - 1) {
                            trimmedLines.push(line.trimLeft());
                            continue;
                        }
                        trimmedLines.push(line);
                        continue;
                    }
    
                    trimmedLines.push(line.trimLeft());
                }
    
                return trimmedLines.join("\n");
            }
        }

        if (minWhitespace == tabSize) {
            return value;
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (i == 0) {
                trimmedLines.push(line);
                continue;
            }

            const wsDiff = line.length - line.trimLeft().length;

            if (wsDiff == tabSize) {
                trimmedLines.push(line);
                continue;
            }

            if (wsDiff >= minWhitespace) {
                trimmedLines.push(line.substring(minWhitespace));
            } else {
                trimmedLines.push(line);
            }
        }

        return trimmedLines.join("\n");
    }

    static shiftIndent(
        value: string,
        targetIndent: number,
        skipFirst: boolean = false,
        options: TransformOptions,
        reflowRelative: boolean = false,
        dedentLast: boolean = false,
        trimShift: boolean = true
    ): string {
        let breakValue = value;

        if (trimShift) {
            breakValue = value.trim();
        }

        const lines = StringUtilities.breakByNewLine(breakValue),
            reflowedLines: string[] = [];

        if (lines.length > 1) {
            let isAlreadyIndentedRelative = true;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i],
                    diff = line.length - line.trim().length,
                    iDiff = targetIndent - diff;

                if (iDiff != 0) {
                    isAlreadyIndentedRelative = false;
                    break;
                }
            }

            if (isAlreadyIndentedRelative) {
                if (lines[0].trimLeft().length == lines[0].length && targetIndent == options.tabSize && reflowRelative) {
                    const relativePadding = ' '.repeat(options.tabSize);

                    lines.forEach((line) => {
                        reflowedLines.push(relativePadding + line);
                    });

                    return reflowedLines.join("\n");
                }
                return value.trim();
            }
        }

        for (let i = 0; i < lines.length; i++) {
            if (i == 0 && skipFirst) { reflowedLines.push(lines[i]); continue; }
            const line = lines[i];

            if (line.trim().length == 0) {
                reflowedLines.push('');
            } else {
                if (dedentLast && i == lines.length - 1) {
                    reflowedLines.push(' '.repeat(targetIndent - options.tabSize) + line);
                } else {
                    reflowedLines.push(' '.repeat(targetIndent) + line);
                }
            }
        }

        return reflowedLines.join("\n");
    }

    static shiftClean(value: string, indent: number): string {
        const lines = StringUtilities.breakByNewLine(value),
            reflowedLines: string[] = [],
            pad = ' '.repeat(indent);
        let hasFoundContent = false;

        lines.forEach((line) => {
            if (line.trim().length > 0) {
                hasFoundContent = true;
            }

            if (!hasFoundContent) { return; }

            if (line.trim().length == 0) {
                reflowedLines.push('');
            } else {
                reflowedLines.push(pad + line);
            }
        })

        return reflowedLines.join("\n");
    }

    static indentAll(content: string, tabSize: number, indentLevel: number) {
        const spaces = indentLevel * tabSize,
            lines: string[] = StringUtilities.breakByNewLine(content);
    }

    static inferIndentLevel(structureLines: string[], value: string, defaultIndent: number): InferredIndentLevel {
        let targetLevel = 0,
            targetLevelFoundOn = -1;
        for (let i = 0; i < structureLines.length; i++) {
            const thisLine = structureLines[i];

            if (thisLine.includes(value)) {
                const trimmed = thisLine.trimLeft();

                targetLevel = thisLine.length - trimmed.length;
                targetLevelFoundOn = i;
                break;
            }
        }

        if (targetLevelFoundOn > 0) {
            for (let i = targetLevelFoundOn - 1; i >= 0; i--) {
                const thisLine = structureLines[i],
                    trimmed = thisLine.trim(),
                    trimmedLeft = thisLine.trimLeft(),
                    checkLevel = thisLine.length - trimmed.length;

                if (trimmedLeft.length == 0) { continue; }

                if (checkLevel != targetLevel && checkLevel < targetLevel) {
                    const inferred = targetLevel - checkLevel;

                    return {
                        targetLevel: targetLevel,
                        referenceLevel: checkLevel,
                        sourceTabSize: inferred
                    }
                }
            }
        }

        return {
            targetLevel: targetLevel,
            referenceLevel: targetLevel,
            sourceTabSize: defaultIndent
        };
    }

    static indent(structureLines: string[], value: string, defaultIndent: number): string {
        const levels = IndentLevel.inferIndentLevel(structureLines, value, defaultIndent);

        return ' '.repeat(levels.targetLevel);
    }
}

export interface InferredIndentLevel {
    targetLevel: number,
    referenceLevel: number,
    sourceTabSize: number
}