// ctype regexes adapted from: https://github.com/locutusjs/locutus/blob/master/src/php/strings/setlocale.js

import { is_numeric } from './isNumeric';

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
        return char?.search(/^[\f\n\r\t\v ]+$/g) !== -1;
    }

    static ctypeAlpha(char: string | null) {
        return char?.search(/^[A-Za-z]+$/g) !== -1;
    }

    static ctypeDigit(char: string | null) {
        return char?.search(/^[\d]+$/g) !== -1;
    }

    static ctypePunct(char: string | null) {
        return char?.search(/^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g) !== -1;
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
        const returnValue = value.substring(1);

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

    static collapse(content: string): string {
        const lines = StringUtilities.breakByNewLine(content);
        let newContent = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();

                if (nextLine.length > 0 && StringUtilities.ctypePunct(nextLine[0])) {
                    const char = nextLine[0];
                    newContent += line;

                    if (char == '?' || char == ':' || char == '&') {
                        newContent += ' ';
                    }
                } else {
                    newContent += line + ' ';
                }
            } else {
                newContent += line;
            }
        }

        return newContent.trimRight();;
    }

    static makeSlug(length: number): string {
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

        return 'B' + result + 'B';
    }

    static replaceWithFillerExceptNewlines(input: string): string {
        const result = input.replace(/./g, (match) => {
            if (match === '\n') {
                return match;
            }
            return 'P';
        });

        return result;
    }

    static safeReplaceAllInString(originalString: string, searchValue: string, replaceValue: string): string {
        const regex = new RegExp(searchValue, 'g'),
            replacedString = originalString.split(regex).join(replaceValue);

        return replacedString;
    }

    static safeReplace(originalString: string, searchValue: string, replaceValue: string): string {
        const replacedString = originalString.split(searchValue).join(replaceValue);

        return replacedString;
    }
}