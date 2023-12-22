import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { DirectiveNode, LiteralNode } from '../nodes/nodes.js';
import { assertCount, assertInstanceOf, assertLiteralContent } from './testUtils/assertions.js';

suite('Ignored Directives', () => {
    test('it can ignore CSS media', () => {
        const nodes = BladeDocument.fromText(`
@media()

@mediaThing()`).getAllNodes();
        assertCount(2, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(DirectiveNode, nodes[1]);
        assertLiteralContent("\n@media()\n\n", nodes[0]);

        const directive = nodes[1] as DirectiveNode;
        assert.strictEqual(directive.directiveName, 'mediaThing');
    });

    test('it does not get confused with whitespace', () => {
        const nodes = BladeDocument.fromText(`
@media () @charset
            @media
@media                ()   @keyframes(

)
@media`).getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
    });
});