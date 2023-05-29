import { StringUtilities } from '../../utilities/stringUtilities';
import { TransformOptions } from '../transformOptions';

export class IndentLevel {
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

    static shiftIndent(value: string, targetIndent: number, skipFirst: boolean = false, options: TransformOptions, reflowRelative:boolean = false): string {
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
                reflowedLines.push(' '.repeat(targetIndent) + line);
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