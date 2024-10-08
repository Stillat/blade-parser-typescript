import { ChildDocument } from '../nodes/nodes.js';
import { Position } from '../nodes/position.js';
import { DocumentIndex } from '../parser/documentIndex.js';
import { DocumentParser } from '../parser/documentParser.js';
import { DocumentCursor } from './documentCursor.js';
import { DocumentErrors } from './documentErrors.js';
import { NodeScanner } from './scanners/nodeScanner.js';
import { Transformer } from './transformer.js';

export class BladeDocument {
    private documentParser: DocumentParser = new DocumentParser();
    private transformer: Transformer | null = null;
    public readonly cursor: DocumentCursor = new DocumentCursor(this);
    public readonly nodes: NodeScanner = new NodeScanner(this);
    public readonly errors: DocumentErrors = new DocumentErrors(this);

    static fromText(text: string, seedPosition: Position | null = null) {
        const document = new BladeDocument();

        if (seedPosition != null) {
            document.getParser().setSeedPosition(seedPosition);
        }

        return document.loadString(text);
    }

    static childFromText(text: string, parentParser: DocumentParser, seedPosition: Position | null = null): ChildDocument {
        const document = new BladeDocument();

        if (seedPosition != null) {
            document.getParser().setSeedPosition(seedPosition);
        }

        document.getParser().withParserOptions(parentParser.getParserOptions()).withPhpValidator(parentParser.getPhpValidator());

        document.loadString(text);

        return {
            renderNodes: document.getRenderNodes(),
            content: text,
            document: document
        };
    }

    isValid() {
        if (this.documentParser.hasUnclosedStructures()) {
            return false;
        }

        return true;
    }

    transform(): Transformer {
        if (this.transformer == null) {
            this.transformer = new Transformer(this);
        }

        return this.transformer;
    }

    loadString(text: string) {
        this.documentParser.parse(text);

        return this;
    }

    getLinesAround(line: number): Map<number, string> {
        return this.documentParser.getLinesAround(line);
    }

    getContent() {
        return this.documentParser.getContent();
    }

    getOriginalContent() {
        return this.documentParser.getOriginalContent();
    }

    getAllNodes() {
        return this.documentParser.getNodes();
    }

    getRenderNodes() {
        return this.documentParser.getRenderNodes();
    }

    getFragments() {
        return this.documentParser.getFragments();
    }

    getParser() {
        return this.documentParser;
    }

    getText(start: number, end: number) {
        return this.documentParser.getText(start, end);
    }

    charLeftAt(position: Position | null) {
        return this.documentParser.charLeftAt(position);
    }

    charAt(position: Position | null) {
        return this.documentParser.charAt(position);
    }

    charRightAt(position: Position | null) {
        return this.documentParser.charRightAt(position);
    }

    getLineIndex(lineNumber: number): DocumentIndex | null {
        return this.documentParser.getLineIndex(lineNumber);
    }

    getLineText(lineNumber: number): string | null {
        return this.documentParser.getLineText(lineNumber);
    }

    wordAt(position: Position | null, tabSize = 4) {
        return this.documentParser.wordAt(position, tabSize);
    }

    wordLeftAt(position: Position | null, tabSize = 4) {
        return this.documentParser.wordLeftAt(position, tabSize);
    }

    wordRightAt(position: Position | null, tabSize = 4) {
        return this.documentParser.wordRightAt(position, tabSize);
    }

    punctuationLeftAt(position: Position | null, tabSize = 4) {
        return this.documentParser.punctuationLeftAt(position, tabSize);
    }

    punctuationRightAt(position: Position | null, tabSize = 4) {
        return this.documentParser.punctuationRightAt(position, tabSize);
    }

    getLineChars(lineNumber: number): string[] | null {
        const lineText = this.getLineText(lineNumber);

        if (lineText != null) {
            return lineText.split("");
        }

        return null;
    }
}