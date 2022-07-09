import { StringUtilities } from '../../utilities/stringUtilities';
import { SeekResults } from '../scanResults';
import { StringIterator } from '../stringIterator';

export function nextNonWhitespace(iterator: StringIterator): SeekResults {
    for (let i = iterator.getCurrentIndex() + 1; i < iterator.inputLength(); i++) {
        const cur = iterator.getChar(i);

        if (!StringUtilities.ctypeSpace(cur)) {
            return {
                didFind: true,
                index: i,
                char: cur
            };
        }
    }

    return {
        didFind: false,
        index: null,
        char: ''
    };
}