import assert = require('assert');
import { BladeDocument } from '../document/bladeDocument';
import { DirectiveNode, LiteralNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf } from './testUtils/assertions';

suite('Basic Directive Pairing', () => {
    test('it can pair directives', () => {
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
@endfor`).getAllNodes();
        assertCount(15, nodes);
        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);
        assertInstanceOf(LiteralNode, nodes[3]);
        assertInstanceOf(DirectiveNode, nodes[4]);
        assertInstanceOf(LiteralNode, nodes[5]);
        assertInstanceOf(DirectiveNode, nodes[6]);
        assertInstanceOf(LiteralNode, nodes[7]);
        assertInstanceOf(DirectiveNode, nodes[8]);
        assertInstanceOf(LiteralNode, nodes[9]);
        assertInstanceOf(DirectiveNode, nodes[10]);
        assertInstanceOf(LiteralNode, nodes[11]);
        assertInstanceOf(DirectiveNode, nodes[12]);
        assertInstanceOf(LiteralNode, nodes[13]);
        assertInstanceOf(DirectiveNode, nodes[14]);

        const d1 = nodes[0] as DirectiveNode, // isset
            d2 = nodes[2] as DirectiveNode, // endisset
            d3 = nodes[4] as DirectiveNode, // isset
            d4 = nodes[6] as DirectiveNode, // isset
            d5 = nodes[8] as DirectiveNode, // endisset
            d6 = nodes[10] as DirectiveNode, // endisset
            d7 = nodes[12] as DirectiveNode, // for
            d8 = nodes[14] as DirectiveNode; //endfor

        assert.strictEqual(d1.isClosedBy, d2);
        assert.strictEqual(d2.isOpenedBy, d1);

        assert.strictEqual(d3.isClosedBy, d6);
        assert.strictEqual(d6.isOpenedBy, d3);

        assert.strictEqual(d4.isClosedBy, d5);
        assert.strictEqual(d5.isOpenedBy, d4);

        assert.strictEqual(d7.isClosedBy, d8);
        assert.strictEqual(d8.isOpenedBy, d7);
    });
});