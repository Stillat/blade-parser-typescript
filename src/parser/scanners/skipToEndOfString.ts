import { DocumentParser } from '../documentParser';
import { StringIterator } from '../stringIterator';

export interface StringResults {
    value: string,
    endedOn: number
}

export function skipToEndOfString(iterator: StringIterator) {
    const stringInitializer = iterator.getCurrent() as string;
    iterator.incrementIndex();

    for (iterator.getCurrentIndex(); iterator.getCurrentIndex() < iterator.inputLength(); iterator.incrementIndex()) {
        iterator.checkCurrentOffsets();

        if (iterator.getCurrent() == stringInitializer && iterator.getPrev() != DocumentParser.String_EscapeCharacter) {
            break;
        }
    }
}

export function skipToEndOfStringTraced(iterator: StringIterator): StringResults {
    const stringInitializer = iterator.getCurrent() as string,
        stringContent: string[] = [];
    iterator.incrementIndex()

    for (iterator.getCurrentIndex(); iterator.getCurrentIndex() < iterator.inputLength(); iterator.incrementIndex()) {
        iterator.checkCurrentOffsets();

        if (iterator.getCurrent() == stringInitializer && iterator.getPrev() != DocumentParser.String_EscapeCharacter) {
            break;
        }

        stringContent.push(iterator.getCurrent() as string);
    }

    return {
        value: stringContent.join(''),
        endedOn: iterator.getCurrentIndex()
    };
}