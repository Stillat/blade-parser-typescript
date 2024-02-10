import { isStartOfString } from './scanners/isStartOfString.js';
import { scanToEndOfLogicGroup } from './scanners/scanToEndOfLogicGroup.js';
import { skipToEndOfStringTraced } from './scanners/skipToEndOfString.js';
import { StringIterator } from './stringIterator.js';

export class ArgStringSplitter implements StringIterator {
    private chars: string[] = [];
    private value: string = '';
    private cur: string | null = null;
    private prev: string | null = null;
    private next: string | null = null;
    private currentIndex = 0;
    private inputLen = 0;
    private currentContent: string[] = [];
    private returnStrings: string[] = [];


    advance(count: number) {
        for (let i = 0; i < count; i++) {
            this.currentIndex++;
            this.checkCurrentOffsets();
        }
    }
    
    encounteredFailure() {
        return;
    }
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
        return this.value.substr(from, length);
    }

    static fromText(value: string): string[] {
        const splitter = new ArgStringSplitter();

        return splitter.split(value);
    }

    private pushCurrentContent() {
        
        const newContent = this.currentContent.join('');

        if (newContent.trim().length > 0) {
            this.returnStrings.push(newContent);
        }
    }

    split(value: string): string[] {
        this.value = value;
        this.chars = value.split('');
        this.returnStrings = [];
        this.inputLen = this.chars.length;

        for (this.currentIndex = 0; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == '[') {
                const arrayResult = scanToEndOfLogicGroup(this, '[', ']');
                
                this.returnStrings.push(arrayResult.content);
                this.currentContent = [];
                continue;
            } else if (this.cur == '(') {
                const groupResult = scanToEndOfLogicGroup(this, '(', ')');
                
                this.returnStrings.push(groupResult.content);
                this.currentContent = [];
                continue;
            } else if (isStartOfString(this.cur)) {
                const results = skipToEndOfStringTraced(this);

                this.currentContent.push(this.cur as string);
                this.currentContent = this.currentContent.concat(results.value.split(''));
                this.currentContent.push(this.cur as string);
                this.currentIndex = results.endedOn;

                if (this.currentIndex == this.inputLen - 1) {
                    this.pushCurrentContent();
                    break;
                }
                continue;
            }

            if (this.cur == ',' || this.next == null) {
                if (this.cur != ',') {
                    this.currentContent.push(this.cur as string);
                }

                this.pushCurrentContent();
                this.currentContent = [];
                continue;
            }

            this.currentContent.push(this.cur as string);
        }

        return this.returnStrings;
    }
}