import { ChildDocument } from '../nodes/nodes';
import { Position } from '../nodes/position';
import { DocumentIndex } from '../parser/documentIndex';
import { DocumentParser } from '../parser/documentParser';
import { DocumentCursor } from './documentCursor';
import { DocumentErrors } from './documentErrors';
import { NodeScanner } from './scanners/nodeScanner';
import { Transformer } from './transformer';

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

    static childFromText(text: string, seedPosition: Position | null = null): ChildDocument {
        const document = BladeDocument.fromText(text, seedPosition);

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