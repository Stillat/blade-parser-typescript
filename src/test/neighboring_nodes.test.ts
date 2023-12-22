import { BladeDocument } from '../document/bladeDocument.js';
import { BladeEchoNode, LiteralNode } from '../nodes/nodes.js';
import { assertCount, assertEchoContent, assertInstanceOf, assertLiteralContent } from './testUtils/assertions.js';

suite('Neighboring Blade Nodes', () => {
    test('it parses simple neighboring nodes', () => {
        const document = BladeDocument.fromText('{{ $one }}{{ $two }}{{ $three }}'),
            nodes = document.getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(BladeEchoNode, nodes[0]);
        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertInstanceOf(BladeEchoNode, nodes[2]);

        const echoOne = nodes[0] as BladeEchoNode,
            echoTwo = nodes[1] as BladeEchoNode,
            echoThree = nodes[2] as BladeEchoNode;

        assertEchoContent(echoOne, ' $one ', '{{ $one }}');
        assertEchoContent(echoTwo, ' $two ', '{{ $two }}');
        assertEchoContent(echoThree, ' $three ', '{{ $three }}');
    });

    test('it parses simple neighboring nodes with literals', () => {
        const document = BladeDocument.fromText('a{{ $one }}b{{ $two }}c{{ $three }}d'),
            nodes = document.getAllNodes();
        assertCount(7, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertInstanceOf(BladeEchoNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);
        assertInstanceOf(BladeEchoNode, nodes[5]);
        assertInstanceOf(LiteralNode, nodes[6]);

        const echoOne = nodes[1] as BladeEchoNode,
            echoTwo = nodes[3] as BladeEchoNode,
            echoThree = nodes[5] as BladeEchoNode;

        assertLiteralContent('a', nodes[0]);
        assertEchoContent(echoOne, ' $one ', '{{ $one }}');
        assertLiteralContent('b', nodes[2]);
        assertEchoContent(echoTwo, ' $two ', '{{ $two }}');
        assertLiteralContent('c', nodes[4]);
        assertEchoContent(echoThree, ' $three ', '{{ $three }}');
        assertLiteralContent('d', nodes[6]);
    });
});