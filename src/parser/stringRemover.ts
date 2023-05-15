import { StringUtilities } from '../utilities/stringUtilities';
import { isStartOfString } from './scanners/isStartOfString';
import { skipToEndOfStringTraced } from './scanners/skipToEndOfString';
import { StringIterator } from './stringIterator';

export class StringRemover implements StringIterator {
    private chars: string[] = [];
    private cur: string | null = null;
    private prev: string | null = null;
    private next: string | null = null;
    private currentIndex = 0;
    private inputLen = 0;
    private currentContent: string[] = [];

    updateIndex(index: number): void {
        this.currentIndex = index;
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
        return '';
    }

    static fromText(value: string): string {
        const splitter = new StringRemover();

        return splitter.remove(value);
    }

    remove(value: string): string {
        this.chars = value.split('');
        this.inputLen = this.chars.length;

        for (this.currentIndex = 0; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (isStartOfString(this.cur)) {
                const results = skipToEndOfStringTraced(this);

                this.currentIndex = results.endedOn;

                if (this.currentIndex == this.inputLen - 1) {
                    break;
                }
                continue;
            }

            this.currentContent.push(this.cur as string);
        }

        const cleanedChars:string[] = [];

        for (let i = 0; i < this.currentContent.length; i++) {
            const char = this.currentContent[i];

            if (i == 0 && char == '@') {
                cleanedChars.push(char);
                continue;
            }

            if (char != '.' && StringUtilities.ctypePunct(char)) {
                break;
            }

            cleanedChars.push(char);
        }

        return cleanedChars.join('');
    }

}