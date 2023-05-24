import { StringUtilities } from '../../utilities/stringUtilities';

export function getPrintWidth(content:string, defaultWidth:number): number {
    if (content.includes("\n") && (
        content.includes('match') || content.includes('=>') || content.includes('&&') ||
        content.includes(',') || content.includes('(')
     )) {
        const lines = StringUtilities.breakByNewLine(content);
        let maxW = 0;

        lines.forEach((line) => {
            const lineL = line.trim().length;
            if (lineL > maxW) {
                maxW = lineL;
            }
        });

        return maxW + Math.ceil(maxW / 2);
    }

    return defaultWidth;
}

export function undoPrettierWorkaround(content:string): string {
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

export function preparePrettierWorkaround(content:string): ILineWorkAroundResult {
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

export interface ILineWorkAroundResult {
    content:string,
    addedHack: boolean
}