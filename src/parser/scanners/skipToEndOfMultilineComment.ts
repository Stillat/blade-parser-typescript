import { DocumentParser } from '../documentParser';
import { StringIterator } from '../stringIterator';

export function skipToEndOfMultilineComment(iterator: StringIterator, collect: boolean) {
    for (iterator.getCurrentIndex(); iterator.getCurrentIndex() < iterator.inputLength(); iterator.incrementIndex()) {
        iterator.checkCurrentOffsets();

        if (collect) {
            iterator.pushChar(iterator.getCurrent() as string);
        }

        if (iterator.getCurrent() == DocumentParser.Punctuation_Asterisk && iterator.getNext() == DocumentParser.Punctuation_ForwardSlash) {
            if (collect) { iterator.pushChar(DocumentParser.Punctuation_ForwardSlash); }
            iterator.incrementIndex();
            iterator.checkCurrentOffsets();
            break;
        }
    }
}