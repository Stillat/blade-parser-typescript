import assert from 'assert';
import { AbstractNode, BladeCommentNode, BladeEchoNode, DirectiveNode, LiteralNode } from '../../nodes/nodes.js';
import { Position } from '../../nodes/position.js';

export function assertCount(count: number, actual: any[]) {
    assert.strictEqual(actual.length, count);
}

export function assertInstanceOf(expected: any, instance: any) {
    assert.strictEqual(instance instanceof expected, true);
}

export function assertLiteralContent(expected: string, node: AbstractNode) {
    const comment = node as LiteralNode;

    assert.strictEqual(comment.content, expected);
}

export function assertCommentContent(expected: string, node: AbstractNode) {
    const comment = node as BladeCommentNode;

    assert.strictEqual(comment.innerContent, expected);
}

export function assertEchoContent(node: BladeEchoNode, content: string, sourceContent: string) {
    assert.strictEqual(node.content, content);
    assert.strictEqual(node.sourceContent, sourceContent);
}

export function assertNull(value: any) {
    assert.strictEqual(value === null, true);
}

export function assertNotNull(value: any) {
    assert.strictEqual(value !== null, true);
}

export function assertPosition(position: Position | null, line: number, char: number) {
    assertNotNull(position);

    const checkPos = position as Position;

    assert.strictEqual(checkPos.line, line);
    assert.strictEqual(checkPos.char, char);
}

export function assertPaired(open: AbstractNode, close: AbstractNode) {
    const openDirective = open as DirectiveNode,
        closeDirective = close as DirectiveNode;
    assertNotNull(openDirective.isClosedBy);
    assertNotNull(closeDirective.isOpenedBy);
    assert.strictEqual(openDirective.isClosedBy, closeDirective);
    assert.strictEqual(closeDirective.isOpenedBy, openDirective);
}