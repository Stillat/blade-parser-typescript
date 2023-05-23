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