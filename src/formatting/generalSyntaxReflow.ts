import { AbstractNode, LiteralNode, OperatorNode } from '../nodes/nodes.js';
import { DocumentParser } from '../parser/documentParser.js';
import { isStartOfString } from '../parser/scanners/isStartOfString.js';
import { skipToEndOfLine } from '../parser/scanners/skipToEndOfLine.js';
import { skipToEndOfMultilineComment } from '../parser/scanners/skipToEndOfMultilineComment.js';
import { skipToEndOfStringTraced } from '../parser/scanners/skipToEndOfString.js';
import { StringIterator } from '../parser/stringIterator.js';
import { StringUtilities } from '../utilities/stringUtilities.js';

export class GeneralSyntaxReflow implements StringIterator {
    private content = '';
    private chars: string[] = [];
    private inputLen = 0;
    private prev: string | null = null;
    private cur: string | null = null;
    private next: string | null = null;
    private currentIndex = 0;
    private currentContent: string[] = [];
    private tokens: AbstractNode[] = [];
    private static breakOperators: string[] = ['!'];
    public static instance: GeneralSyntaxReflow = new GeneralSyntaxReflow();
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
        return this.content.substr(from, length);
    }

    getTokens(): AbstractNode[] {
        return this.tokens;
    }

    static couldReflow(input: string): boolean {
        return GeneralSyntaxReflow.breakOperators.some(sb => input.includes(sb));
    }

    safeReflow(input: string): string {
        if (! GeneralSyntaxReflow.couldReflow(input)) {
            return input;
        }

        return this.reflow(input);
    }

    parse(text: string): void {
        this.tokens = [];
        this.content = StringUtilities.normalizeLineEndings(text);
        this.chars = this.content.split('');
        this.inputLen = this.chars.length;

        // Break the input string into tokens to help build on the final array nodes.
        for (this.currentIndex = 0; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (StringUtilities.ctypeSpace(this.cur)) {
                this.currentContent.push(this.cur as string);
                continue;
            }

            if (isStartOfString(this.cur)) {
                const terminator = this.cur as string,
                    results = skipToEndOfStringTraced(this);

                this.pushChar(terminator);
                this.currentContent = this.currentContent.concat(results.value.split(''));
                this.pushChar(terminator);
                this.currentIndex = results.endedOn;
                continue;
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_ForwardSlash) {
                skipToEndOfLine(this, true);
                continue;
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_Asterisk) {
                skipToEndOfMultilineComment(this, true);

                continue;
            }

            if (this.cur != null) {
                if (this.cur === '!' && this.next !== '=') {
                    if (this.currentContent.length > 0) {
                        const literal = new LiteralNode();
                        literal.content = this.currentContent.join('');
                        this.currentContent = [];
                        this.tokens.push(literal);
                    }

                    const operator = new OperatorNode();
                    operator.sourceContent = this.cur;
                    this.tokens.push(operator);
                    this.currentContent = [];
                    continue;
                } else {
                    this.currentContent.push(this.cur);
                }
            }
        }

        if (this.currentContent.length > 0) {
            const literal = new LiteralNode();
            literal.content = this.currentContent.join('');
            this.currentContent = [];
            this.tokens.push(literal);
        }
    }

    reflow(input: string): string {
        try {
            this.parse(input);
        } catch (err) {
            // Prevent errors from crashing formatting.
            return input;
        }

        let output = '',
            lastWasOperator = false;

        this.tokens.forEach((token) => {
            if (token instanceof OperatorNode) {
                lastWasOperator = true;
                output += token.sourceContent + ' ';
                return;
            }

            if (token instanceof LiteralNode) {
                if (lastWasOperator) {
                    output += token.content.trimLeft();
                } else {
                    output += token.content;
                }
            }

            lastWasOperator = false;
        });

        return output;
    }
}