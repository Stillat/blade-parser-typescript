import { isStartOfString } from './scanners/isStartOfString.js';
import { scanToEndOfLogicGroup } from './scanners/scanToEndOfLogicGroup.js';
import { skipToEndOfStringTraced } from './scanners/skipToEndOfString.js';
import { StringIterator } from './stringIterator.js';

export class ParenUnwrapper implements StringIterator
{
    private chars: string[] = [];
    private value: string = '';
    private cur: string | null = null;
    private prev: string | null = null;
    private next: string | null = null;
    private currentIndex = 0;
    private inputLen = 0;
    private currentContent: string[] = [];

    updateIndex(index: number): void {
        this.currentIndex = index;
    }
    advance(count: number): void {
        for (let i = 0; i < count; i++) {
            this.currentIndex++;
            this.checkCurrentOffsets();
        }
    }
    inputLength(): number {
        return this.inputLen;
    }
    getCurrentIndex(): number {
        return this.currentIndex;
    }
    incrementIndex(): void {
        this.currentIndex += 1;
    }
    getCurrent(): string | null {
        return this.cur;
    }
    getNext(): string | null {
        return this.next;
    }
    getPrev(): string | null {
        return this.prev;
    }
    checkCurrentOffsets(): void {
        this.cur = this.chars[this.currentIndex];

        this.prev = null;
        this.next = null;

        if (this.currentIndex > 0) {
            this.prev = this.chars[this.currentIndex - 1];
        }

        if ((this.currentIndex + 1) < this.inputLen) {
            this.next = this.chars[this.currentIndex + 1];
        }
    }
    pushChar(value: string): void {
        this.currentContent.push(value);
    }
    getChar(index: number): string {
        return this.chars[index];
    }
    getSeedOffset(): number {
        return 0;
    }
    getContentSubstring(from: number, length: number): string {
        return this.value.substr(from, length);
    }
    encounteredFailure(): void {
    }
    unwrap(value: string): string
    {
        value = value.trim();

        if (! (value.startsWith('(') && value.endsWith(')'))) {
            return value;
        }

        this.value = value;
        this.chars = value.split('');
        this.inputLen = this.chars.length;

        for (this.currentIndex = 0; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == '(' && this.currentIndex == 0) {
                const groupResult = scanToEndOfLogicGroup(this, '(', ')');

                if (groupResult.content == value) {
                    let tmpUnwrap = groupResult.content.substring(1);

                    return this.unwrap(tmpUnwrap.substring(0, tmpUnwrap.length - 1));
                } else {
                    break;
                }
            }

            break;
        }

        return value;
    }
}