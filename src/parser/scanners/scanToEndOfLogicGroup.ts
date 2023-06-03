import { DocumentParser } from '../documentParser';
import { LogicGroupScanResults } from '../scanResults';
import { StringIterator } from '../stringIterator';
import { isStartOfString } from './isStartOfString';
import { skipToEndOfLine } from './skipToEndOfLine';
import { skipToEndOfMultilineComment } from './skipToEndOfMultilineComment';
import { skipToEndOfString } from './skipToEndOfString';

export function scanToEndOfLogicGroup(iterator: StringIterator): LogicGroupScanResults {
    const groupStartedOn = iterator.getCurrentIndex() + iterator.getSeedOffset(),
        recoveryIndex = iterator.getCurrentIndex();
    let groupEndsOn = 0,
        groupOpenCount = 0,
        foundEnd = false;

    // Advance over the initial "(".
    iterator.incrementIndex();

    for (iterator.getCurrentIndex(); iterator.getCurrentIndex() < iterator.inputLength(); iterator.incrementIndex()) {
        iterator.checkCurrentOffsets();

        if (isStartOfString(iterator.getCurrent())) {
            const stringStart = iterator.getCurrent(),
                recoveryIndex = iterator.getCurrentIndex();
            skipToEndOfString(iterator);

            if (iterator.getNext() === null && iterator.getCurrent() !== stringStart) {
                iterator.updateIndex(recoveryIndex + 1);
                iterator.encounteredFailure();
            }
            continue;
        }

        if (iterator.getCurrent() == DocumentParser.Punctuation_ForwardSlash && iterator.getNext() == DocumentParser.Punctuation_Asterisk) {
            skipToEndOfMultilineComment(iterator, false);
            continue;
        }

        if (iterator.getCurrent() == DocumentParser.Punctuation_ForwardSlash && iterator.getNext() == DocumentParser.Punctuation_ForwardSlash) {
            skipToEndOfLine(iterator, false);
            continue;
        }

        if (iterator.getCurrent() == DocumentParser.LeftParen) {
            groupOpenCount += 1;
            continue;
        }

        if (iterator.getCurrent() == DocumentParser.RightParen) {
            if (groupOpenCount > 0) {
                groupOpenCount -= 1;
                continue;
            }

            groupEndsOn = iterator.getCurrentIndex() + iterator.getSeedOffset() + 1;
            foundEnd = true;
            break;
        }

        if (iterator.getCurrent() == null) { break; }
    }

    const groupContent = iterator.getContentSubstring(groupStartedOn, groupEndsOn - groupStartedOn);

    if (! foundEnd) {
        iterator.updateIndex(recoveryIndex - 1);
    }

    return {
        start: groupStartedOn,
        end: groupEndsOn,
        content: groupContent,
        foundEnd: foundEnd
    };
}