import assert = require('assert');
import { BladeDocument } from '../document/bladeDocument';
import { DirectiveNode, LiteralNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf, assertLiteralContent } from './testUtils/assertions';

suite('Child Nodes', () => {
    test('test it associates child nodes', () => {
        const nodes = BladeDocument.fromText(`@isset
Test
@endisset


@isset


    @isset
    Test
    @endisset

    Test
@endisset

@for
something
@endfor`).getRenderNodes();
        assertCount(5, nodes);
        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);
        assertInstanceOf(LiteralNode, nodes[3]);
        assertInstanceOf(DirectiveNode, nodes[4]);

        assertLiteralContent("\n\n\n", nodes[1]);
        assertLiteralContent("\n\n", nodes[3]);

        const d1 = nodes[0] as DirectiveNode,
            d2 = nodes[2] as DirectiveNode,
            d3 = nodes[4] as DirectiveNode;

        assert.strictEqual(d1.directiveName, 'isset');
        assert.strictEqual(d1.documentContent, "\nTest\n");
        assertCount(2, d1.children);

        assertInstanceOf(LiteralNode, d1.children[0]);
        assertInstanceOf(DirectiveNode, d1.children[1]);
        assertLiteralContent("\nTest\n", d1.children[0]);

        assert.strictEqual(d2.directiveName, 'isset');
        assert.strictEqual(d2.documentContent, "\n\n\n    @isset\n    Test\n    @endisset\n\n    Test\n");
        assertCount(4, d2.children);

        assertInstanceOf(LiteralNode, d2.children[0]);
        assertLiteralContent("\n\n\n    ", d2.children[0]);
        assertInstanceOf(DirectiveNode, d2.children[1]);

        const d2d1 = d2.children[1] as DirectiveNode;
        assert.strictEqual(d2d1.directiveName, 'isset');
        assertCount(2, d2d1.children);
        assertInstanceOf(LiteralNode, d2d1.children[0]);
        assertInstanceOf(DirectiveNode, d2d1.children[1]);
        assertLiteralContent("\n    Test\n    ", d2d1.children[0]);

        assertInstanceOf(LiteralNode, d2.children[2]);
        assertLiteralContent("\n\n    Test\n", d2.children[2]);
        assertInstanceOf(DirectiveNode, d2.children[3]);

        assert.strictEqual(d3.directiveName, 'for');
        assert.strictEqual(d3.documentContent, "\nsomething\n");
        assertCount(2, d3.children);

        assertInstanceOf(LiteralNode, d3.children[0]);
        assertInstanceOf(DirectiveNode, d3.children[1]);
        assertLiteralContent("\nsomething\n", d3.children[0]);
    });
});