
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ctype = require('locutus/php/ctype');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const is_numeric = require('locutus/php/var/is_numeric');

export class StringUtilities {
    static normalizeLineEndings(string: string, to = "\n") {
        return string.replace(/\r?\n/g, to);
    }
    static split(text: string) {
        return text.split('');
    }

    static substring(text: string, start: number, length: number) {
        return text.substr(start, length);
    }

    static ctypeSpace(char: string | null) {
        return ctype.ctype_space(char);
    }

    static ctypeAlpha(char: string | null) {
        return ctype.ctype_alpha(char);
    }

    static ctypeDigit(char: string | null) {
        return ctype.ctype_digit(char);
    }

    static ctypePunct(char: string | null) {
        return ctype.ctype_punct(char);
    }

    static trimLeft(value: string, charList = "\\s") {
        return value.replace(new RegExp("^[" + charList + "]+"), '');
    }

    static trimRight(value: string, charList = "\\s") {
        return value.replace(new RegExp("[" + charList + "]+$"), '');
    }

    static isNumeric(string: string) {
        return is_numeric(string);
    }

    static substringCount(haystack: string, needle: string) {
        const subStr = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return (haystack.match(new RegExp(subStr, 'gi')) || []).length;
    }

    static lastWord(value: string): string {
        const chars = value.split(''),
            wordChars = [];

        for (let i = chars.length; i >= 0; i--) {
            if (chars[i] == ' ') {
                break;
            }

            wordChars.push(chars[i]);
        }

        return wordChars.reverse().join();
    }

    static breakByNewLine(value: string): string[] {
        return value.replace(/(\r\n|\n|\r)/gm, "\n").split("\n") as string[];
    }

    static removeEmptyNewLines(value: string): string {
        const newLines: string[] = [],
            lines = StringUtilities.breakByNewLine(StringUtilities.normalizeLineEndings(value));

        lines.forEach((line) => {
            if (line.trim().length > 0) {
                newLines.push(line);
            }
        });

        return newLines.join("\n");
    }

    static replaceAllInString(value: string, oldString: string, newString: string): string {
        return value.replace(new RegExp(oldString, 'g'), newString);
    }

    static getTrimmedMatch(expression: RegExp, value: string, index: number): string | null {
        const match = expression.exec(value);

        if (match == null || match.length < index) {
            return null;
        }

        const candidate = match[index].trim();

        if (candidate.length == 0) {
            return null;
        }

        return candidate;
    }

    static assertMatchIs(expression: RegExp, value: string, index: number, testValue: string): boolean {
        const candidate = StringUtilities.getTrimmedMatch(expression, value, index);

        if (candidate != null && candidate == testValue) {
            return true;
        }

        return false;
    }

    static truncateString(str: string, num: number) {
        if (str.length <= num) {
            return str;
        }

        return str.slice(0, num) + '...';
    }

    static unwrapString(value: string): string {
        let returnValue = value.substring(1);

        return returnValue.substring(0, returnValue.length - 1);
    }

    static getLastLine(content: string): string {
        const lines = StringUtilities.breakByNewLine(content);

        if (lines.length == 0) { return ''; }

        return lines[lines.length - 1];
    }

    static getFirstLine(content: string): string {
        const lines = StringUtilities.breakByNewLine(content);

        if (lines.length == 0) { return ''; }

        return lines[0];
    }
}