import { AbstractNode } from '../nodes/nodes';
import { BladeDocument } from './bladeDocument';
import { NodeQueries } from './scanners/nodeQueries';

export class DocumentCursor {
    private doc: BladeDocument;

    constructor(doc: BladeDocument) {
        this.doc = doc;
    }

    getNodeAt(line: number, char: number): AbstractNode | null {
        return NodeQueries.findNodeAtPosition(this.position(line, char), this.doc.getParser().getNodes());
    }

    getNodeBefore(line: number, char: number): AbstractNode | null {
        return NodeQueries.findNodeBeforePosition(
            this.position(line, char),
            this.doc.getParser().getNodes()
        );
    }

    getNodeAfter(line: number, char: number): AbstractNode | null {
        return NodeQueries.findNodeAfterPosition(
            this.position(line, char),
            this.doc.getParser().getNodes()
        );
    }

    getNodesBefore(line: number, char: number): AbstractNode[] {
        return NodeQueries.findNodesBeforePosition(
            this.position(line, char),
            this.doc.getParser().getNodes()
        );
    }

    getNodesAfter(line: number, char: number): AbstractNode[] {
        return NodeQueries.findNodesAfterPosition(
            this.position(line, char),
            this.doc.getParser().getNodes()
        );
    }

    position(line: number, char: number) {
        return this.doc.getParser().positionFromCursor(line, char);
    }

    charLeftAt(line: number, char: number) {
        return this.doc.getParser().charLeftAtCursor(line, char);
    }

    charAt(line: number, char: number) {
        return this.doc.getParser().charAtCursor(line, char);
    }

    charRightAt(line: number, char: number) {
        return this.doc.getParser().charRightAtCursor(line, char);
    }

    wordLeftAt(line: number, char: number, tabSize = 4) {
        return this.doc.getParser().wordLeftAtCursor(line, char, tabSize);
    }

    wordRightAt(line: number, char: number, tabSize = 4) {
        return this.doc.getParser().wordRightAtCursor(line, char, tabSize);
    }
    wordAt(line: number, char: number, tabSize = 4) {
        return this.doc.getParser().wordAtCursor(line, char, tabSize);
    }

    punctuationLeftAt(line: number, char: number, tabSize = 4) {
        return this.doc.getParser().punctuationLeftAtCursor(line, char, tabSize);
    }

    punctuationRightAt(line: number, char: number, tabSize = 4) {
        return this.doc.getParser().punctuationRightAtCursor(line, char, tabSize);
    }
}