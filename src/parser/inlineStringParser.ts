import { ILabeledRange } from '../nodes/labeledRange';
import { isStartOfString } from './scanners/isStartOfString';
import { skipToEndOfLine } from './scanners/skipToEndOfLine';
import { skipToEndOfMultilineComment } from './scanners/skipToEndOfMultilineComment';
import { skipToEndOfStringTraced } from './scanners/skipToEndOfString';
import { StringIterator } from './stringIterator';

export interface IStringParserNode {
    content: string;
    type: string;
    index: number;
}

export class InlineStringParser implements StringIterator {
    private ignoreRanges: ILabeledRange[] = [];
    private strings: string[] = [];
    private nodes: IStringParserNode[] = [];
    private chars: string[] = [];
    private cur: string | null = null;
    private prev: string | null = null;
    private next: string | null = null;
    private currentIndex = 0;
    private inputLen = 0;
    private currentContent: string[] = [];
    private nodeIndex: number = 0;
    private hasStringNodesInResult: boolean = false;
    
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
        return '';
    }

    setIgnoreRanges(ranges: ILabeledRange[]) {
        this.ignoreRanges = ranges;
    }

    hasStringNodes(): boolean {
        return this.hasStringNodesInResult;
    }

    parse(value: string) {
        this.strings = [];
        this.chars = value.split('');
        this.inputLen = this.chars.length;

        for (this.currentIndex = 0; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == '/' && this.next == '/') {
                skipToEndOfLine(this, true);
                continue;
            }

            if (this.cur == '/' && this.next == '*') {
                skipToEndOfMultilineComment(this, true);
                continue;
            }

            if (isStartOfString(this.cur)) {
                const stringStart = this.cur,
                    stringStartedOn = this.currentIndex;

                if (this.currentContent.length > 0) {
                    const literalNode: IStringParserNode = {
                        content: this.currentContent.join(''),
                        type: 'literal',
                        index: this.nodeIndex
                    };
                    this.nodeIndex++;
                    this.nodes.push(literalNode);
                    this.currentContent = [];
                }
                const results = skipToEndOfStringTraced(this);

                // Is this string inside an ingored range?
                let insideIgnoredRange = false;

                for (let i = 0; i < this.ignoreRanges.length; i++) {
                    const range = this.ignoreRanges[i];

                    if (stringStartedOn >= range.start && this.currentIndex <= range.end) {
                        insideIgnoredRange = true;
                        break;
                    }
                }

                if (insideIgnoredRange) {
                    this.currentContent.push(stringStart as string);
                    for (let i = 0; i < results.value.length; i++) {
                        this.currentContent.push(results.value[i]);
                    }
                    this.currentContent.push(stringStart as string);
                } else {
                    this.strings.push(results.value);
                    const stringNode: IStringParserNode = {
                        content: stringStart + results.value + stringStart,
                        type: 'string',
                        index: this.nodeIndex,
                    };
                    this.hasStringNodesInResult = true;
                    this.nodeIndex++;
                    this.nodes.push(stringNode);
                }

                this.currentIndex = results.endedOn;

                if (this.currentIndex == this.inputLen - 1) {
                    break;
                }
                continue;
            }

            this.currentContent.push(this.cur as string);
        }

        if (this.currentContent.length > 0) {
            const literalNode: IStringParserNode = {
                content: this.currentContent.join(''),
                type: 'literal',
                index: this.nodeIndex
            };
            this.nodeIndex++;
            this.nodes.push(literalNode);
            this.currentContent = [];
        }
    }

    getParsedNodes(): IStringParserNode[] {
        return this.nodes;
    }
}