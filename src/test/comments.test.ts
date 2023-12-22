import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { BladeCommentNode, BladeEchoNode, LiteralNode } from '../nodes/nodes.js';
import { assertCommentContent, assertCount, assertEchoContent, assertInstanceOf, assertLiteralContent } from './testUtils/assertions.js';

suite('Blade Comments', () => {
    test('comments with braces does not confuse the parser', () => {
        const document = BladeDocument.fromText('{{--a{{ $one }}b{{ $two }}c{{ $three }}d--}}a{{ $one }}b{{ $two }}c{{ $three }}d'),
            nodes = document.getAllNodes();
        assertCount(8, nodes);

        assertInstanceOf(BladeCommentNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(BladeEchoNode, nodes[2]);
        assertInstanceOf(LiteralNode, nodes[3]);
        assertInstanceOf(BladeEchoNode, nodes[4]);
        assertInstanceOf(LiteralNode, nodes[5]);
        assertInstanceOf(BladeEchoNode, nodes[6]);
        assertInstanceOf(LiteralNode, nodes[7]);

        const comment = nodes[0] as BladeCommentNode;

        assert.strictEqual(comment.innerContent, "a{{ $one }}b{{ $two }}c{{ $three }}d");
        assert.strictEqual(comment.sourceContent, "{{--a{{ $one }}b{{ $two }}c{{ $three }}d--}}");

        const echoOne = nodes[2] as BladeEchoNode,
            echoTwo = nodes[4] as BladeEchoNode,
            echoThree = nodes[6] as BladeEchoNode;

        assertLiteralContent('a', nodes[1]);
        assertEchoContent(echoOne, ' $one ', '{{ $one }}');
        assertLiteralContent('b', nodes[3]);
        assertEchoContent(echoTwo, ' $two ', '{{ $two }}');
        assertLiteralContent('c', nodes[5]);
        assertEchoContent(echoThree, ' $three ', '{{ $three }}');
        assertLiteralContent('d', nodes[7]);
    });

    test('comment 2', () => {
        const nodes = BladeDocument.fromText('{{--this is a comment--}}').getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(BladeCommentNode, nodes[0]);
        assertCommentContent('this is a comment', nodes[0]);
    });

    test('comment 3', () => {
        const nodes = BladeDocument.fromText('{{-- @foreach() --}}').getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(BladeCommentNode, nodes[0]);
        assertCommentContent(' @foreach() ', nodes[0]);
    });
});