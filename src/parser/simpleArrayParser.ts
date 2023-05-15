import { AbstractNode, ArrayElementNode, ArrayElementSeparatorNode, ArrayEndNode, ArrayKeyValueNode, ArrayNode, ArrayStartNode } from '../nodes/nodes';
import { StringUtilities } from '../utilities/stringUtilities';
import { DocumentParser } from './documentParser';
import { isStartOfString } from './scanners/isStartOfString';
import { skipToEndOfStringTraced } from './scanners/skipToEndOfString';
import { StringIterator } from './stringIterator';

export class SimpleArrayParser implements StringIterator {
    private content = '';
    private chars: string[] = [];
    private inputLen = 0;
    private prev: string | null = null;
    private cur: string | null = null;
    private next: string | null = null;
    private currentIndex = 0;
    private currentContent: string[] = [];
    private tokens: AbstractNode[] = [];
    private createdArrays: ArrayNode[] = [];
    private keyValueTokens: number = 0;
    private elements: number = 0;

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
    getNumberOfElements(): number {
        return this.elements;
    }
    getNumberOfKeyValuePairs(): number {
        return this.keyValueTokens;
    }
    getIsAssoc(): boolean {
        return this.elements == this.keyValueTokens;
    }
    private checkCurrentContent() {
        if (this.currentContent.length > 0) {
            const value = this.currentContent.join(''),
                valueNode = new AbstractNode();

            if (value.trim().length == 0) {
                this.currentContent = [];
                return;
            }

            valueNode.sourceContent = value;
            this.tokens.push(valueNode);
            this.currentContent = [];
        }
    }

    parse(text: string): ArrayNode | null {
        this.content = StringUtilities.normalizeLineEndings(text);
        this.chars = this.content.split('');
        this.inputLen = this.chars.length;

        // Break the input string into tokens to help build on the final array nodes.
        for (this.currentIndex = 0; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (StringUtilities.ctypeSpace(this.cur)) {
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

            if (this.cur == DocumentParser.LeftBracket) {
                this.checkCurrentContent();
                this.tokens.push(new ArrayStartNode());
                continue;
            } else if (this.cur == DocumentParser.RightBracket) {
                this.checkCurrentContent();
                this.tokens.push(new ArrayEndNode());
            } else if (this.cur == DocumentParser.Punctuation_Comma) {
                this.checkCurrentContent();
                this.tokens.push(new ArrayElementSeparatorNode());
                this.currentContent = [];
            } else if (this.cur == DocumentParser.Punctuation_Equals && this.next == DocumentParser.Punctuation_GreaterThan) {
                this.checkCurrentContent();
                this.currentIndex += 1;
                this.tokens.push(new ArrayKeyValueNode());
                continue;
            } else {
                this.currentContent.push(this.cur as string);
            }
        }

        const array = this.parseArrays(this.tokens);
        this.fillArrayDetails();

        array?.elements.filter(function (el) {
            if (el.value instanceof ArrayElementSeparatorNode) {
                return false;
            }

            return true;
        }).forEach((el) => {
            this.elements += 1;
            if (el.key != null && el.value != null) {
                this.keyValueTokens += 1;
            }
        });

        return array;
    }

    private fillArrayDetails() {
        this.createdArrays.forEach((array) => {
            array.elements.forEach((element, index) => {
                if (element.key != null) {
                    array.containsKeys = true;
                    if (element.key.sourceContent.length > array.maxKeyLength) {
                        array.maxKeyLength = element.key.sourceContent.length;
                    }
                }

                element.isLast = index == array.elements.length - 1;
            });
        });
    }

    private parseArrays(tokens: AbstractNode[]): ArrayNode | null {
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token instanceof ArrayStartNode) {
                const arrayNodes = this.findEndOfArray(tokens.slice(i));
                i += arrayNodes.length;

                arrayNodes.shift();
                arrayNodes.pop();
                return this.createArray(arrayNodes, true);
            }
        }

        return null;
    }

    private createArray(tokens: AbstractNode[], isRoot: boolean): ArrayNode {
        const returnArray = new ArrayNode();

        this.createdArrays.push(returnArray);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let nextToken: AbstractNode | null = null;

            if (i + 1 < tokens.length) {
                nextToken = tokens[i + 1];
            }

            if (nextToken instanceof ArrayElementSeparatorNode || nextToken == null) {
                const element = new ArrayElementNode();
                element.value = token;
                returnArray.elements.push(element);

                i += 1;
                continue;
            } else if (nextToken instanceof ArrayKeyValueNode) {
                const valueNode = tokens[i + 2];

                if (valueNode instanceof ArrayStartNode == false) {
                    const element = new ArrayElementNode();
                    element.key = token;
                    element.value = valueNode;
                    returnArray.elements.push(element);

                    i += 3;
                    continue;
                } else {
                    const arrayNodes = this.findEndOfArray(tokens.slice(i + 2)),
                        element = new ArrayElementNode();
                    i += arrayNodes.length + 1;
                    arrayNodes.shift();
                    arrayNodes.pop();
                    
                    element.key = token;
                    element.value = this.createArray(arrayNodes, false);
                    returnArray.elements.push(element);

                    continue;
                }
            } else if (token instanceof ArrayStartNode) {
                const arrayNodes = this.findEndOfArray(tokens.slice(i)),
                    element = new ArrayElementNode();
                i += arrayNodes.length;
                
                arrayNodes.shift();
                arrayNodes.pop();

                element.value = this.createArray(arrayNodes, false);
                continue;
            }
        }

        return returnArray;
    }

    private findEndOfArray(tokens: AbstractNode[]): AbstractNode[] {
        const arrayTokens: AbstractNode[] = [];
        let stackCount = 0;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            arrayTokens.push(token);
            if (token instanceof ArrayStartNode) {
                stackCount += 1;
                continue;
            } else if (token instanceof ArrayEndNode) {
                stackCount -= 1;

                if (stackCount <= 0) {
                    break;
                }

                continue;
            }
        }

        return arrayTokens;
    }
}