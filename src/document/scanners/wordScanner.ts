import { DocumentParser } from '../../parser/documentParser';
import { StringUtilities } from '../../utilities/stringUtilities';

export class WordScanner {

    static findRightBeighboringNextPunctuation(index: number, text: string, tabSize = 4) {
        text = text.replace("\t", ' '.repeat(tabSize));

        let okayToBreak = false;

        for (let i = index + 1; i < text.length; i++) {
            const cur = text[i];

            if (StringUtilities.ctypeSpace(cur)) {
                okayToBreak = true;
            }

            if (okayToBreak && (StringUtilities.ctypeAlpha(cur) || StringUtilities.ctypeDigit(cur))) {
                return null;
            }

            if (StringUtilities.ctypePunct(cur) || cur == DocumentParser.String_Terminator_SingleQuote || cur == DocumentParser.String_Terminator_DoubleQuote) {
                return cur;
            }
        }

        return null;
    }

    static findRightNeighboringNextAlphaNumeric(index: number, text: string, tabSize = 4) {
        text = text.replace("\t", ' '.repeat(tabSize));

        let okayToBreak = false;

        for (let i = index + 1; i < text.length; i++) {
            const cur = text[i];

            if (StringUtilities.ctypeSpace(cur) || (StringUtilities.ctypePunct(cur) && cur != DocumentParser.Punctuation_Underscore)) {
                okayToBreak = true;
            }

            if (okayToBreak && (StringUtilities.ctypeAlpha(cur) || StringUtilities.ctypeDigit(cur))) {
                return i + 1;
            }
        }

        return null;
    }

    static findLeftNeighboringNextPunctuation(index: number, text: string, tabSize = 4) {
        text = text.replace("\t", ' '.repeat(tabSize));

        let okayToBreak = false;

        for (let i = index - 2; i >= 0; i--) {
            const cur = text[i];

            if (StringUtilities.ctypeSpace(cur)) {
                okayToBreak = true;
            }

            if (okayToBreak && (StringUtilities.ctypeAlpha(cur) || StringUtilities.ctypeDigit(cur))) {
                return null;
            }

            if (StringUtilities.ctypePunct(cur)) {
                return cur;
            }
        }

        return null;
    }

    static findLeftNeighboringNextAlphaNumeric(index: number, text: string, tabSize = 4) {
        text = text.replace("\t", ' '.repeat(tabSize));

        let okayToBreak = false;

        for (let i = index - 1; i >= 0; i--) {
            const cur = text[i];

            if (StringUtilities.ctypeSpace(cur) || (StringUtilities.ctypePunct(cur) && cur != DocumentParser.Punctuation_Underscore)) {
                okayToBreak = true;
            }

            if (okayToBreak && (StringUtilities.ctypeAlpha(cur) || StringUtilities.ctypeDigit(cur))) {
                return i + 1;
            }
        }

        return null;
    }

    static scanWordAt(index: number, text: string, tabSize = 4) {
        text = text.replace("\t", ' '.repeat(tabSize));
        if (index < 0 || index > text.length) {
            return null;
        }

        const leftChars: string[] = [],
            rightChars: string[] = [];

        for (let i = index - 1; i >= 0; i--) {
            const cur = text[i];

            if ((StringUtilities.ctypePunct(cur) && cur != DocumentParser.Punctuation_Underscore) || StringUtilities.ctypeSpace(cur)) {
                break;
            }

            leftChars.push(cur);
        }

        for (let i = index; i < text.length; i++) {
            const cur = text[i];

            if ((StringUtilities.ctypePunct(cur) && cur != DocumentParser.Punctuation_Underscore) || StringUtilities.ctypeSpace(cur)) {
                break;
            }

            rightChars.push(cur);
        }

        return leftChars.reverse().join('') + rightChars.join('');
    }
}