import { DocumentParser } from '../documentParser';
import { StringIterator } from '../stringIterator';

export function skipToEndOfLine(iterator: StringIterator, collect: boolean) {
    for (iterator.getCurrentIndex(); iterator.getCurrentIndex() < iterator.inputLength(); iterator.incrementIndex()) {
        iterator.checkCurrentOffsets();

        if (collect) {
            iterator.pushChar(iterator.getCurrent() as string);
        }

        if (iterator.getCurrent() == DocumentParser.NewLine) {
            break;
        }
    }
}