import assert = require('assert');
import { BladeDocument } from '../document/bladeDocument';
import { BladeEchoNode, ChildDocument, DirectiveNode, ForElseNode, LiteralNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf, assertLiteralContent, assertNotNull, assertNull } from './testUtils/assertions';

suite('For Else Nodes', () => {
    test('it can parse forelse with empty', () => {
        const nodes = BladeDocument.fromText(`@forelse ($users as $user)
<li>{{ $user->name }}</li>
@empty
<p>No users</p>
@endforelse`).getRenderNodes();
        assertCount(1, nodes);
        assertInstanceOf(ForElseNode, nodes[0]);

        const forElse = nodes[0] as ForElseNode;
        assertNotNull(forElse.elseNode);
        assertCount(3, forElse.truthNodes);
        assertCount(1, forElse.falseNodes);

        assertInstanceOf(LiteralNode, forElse.falseNodes[0]);
        assertLiteralContent("\n<p>No users</p>\n", forElse.falseNodes[0]);

        const truthNodes = forElse.truthNodes;

        assertInstanceOf(LiteralNode, truthNodes[0]);
        assertLiteralContent("\n<li>", truthNodes[0]);
        assertInstanceOf(BladeEchoNode, truthNodes[1]);
        const tDirective = truthNodes[1] as BladeEchoNode;
        assert.strictEqual(tDirective.content, " $user->name ");

        assertInstanceOf(LiteralNode, truthNodes[2]);
        assertLiteralContent("</li>\n", truthNodes[2]);
    });

    test('it parses without empty', () => {
        const nodes = BladeDocument.fromText(`@forelse ($users as $user)
<li>{{ $user->name }}</li>
<p>No users</p>
@endforelse`).getRenderNodes();
        assertCount(1, nodes);
        assertInstanceOf(ForElseNode, nodes[0]);

        const forElse = nodes[0] as ForElseNode;
        assertNull(forElse.elseNode);
        assertCount(0, forElse.falseNodes);
        assertCount(3, forElse.truthNodes);

        const children = forElse.truthNodes;

        assertInstanceOf(LiteralNode, children[0]);
        assertLiteralContent("\n<li>", children[0]);
        assertInstanceOf(BladeEchoNode, children[1]);
        const bladeEcho = children[1] as BladeEchoNode;
        assert.strictEqual(bladeEcho.sourceContent, "{{ $user->name }}");
        assert.strictEqual(bladeEcho.content, " $user->name ");

        assertInstanceOf(LiteralNode, children[2]);
        assertLiteralContent("</li>\n<p>No users</p>\n", children[2]);
    });

    test('nested forelse', () => {
        const nodes = BladeDocument.fromText(`
@forelse ($users as $user)
<li>{{ $user->name }}</li>

    @forelse ($users2 as $user2)
    <li>{{ $user2->name }}</li>
    @empty
    <p>No users2</p>
    @endforelse

@empty
<p>No users</p>
@endforelse`).getRenderNodes();
        assertCount(2, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("\n", nodes[0]);
        assertInstanceOf(ForElseNode, nodes[1]);

        const forElseOne = nodes[1] as ForElseNode;
        assertCount(1, forElseOne.falseNodes);
        assertCount(11, forElseOne.truthNodes);
        assertNotNull(forElseOne.falseDocument);
        assertNotNull(forElseOne.truthDocument);

        const truthDocument = forElseOne.truthDocument as ChildDocument;
        assertCount(5, truthDocument.renderNodes);
        assertInstanceOf(LiteralNode, truthDocument.renderNodes[0]);
        assertLiteralContent("\n<li>", truthDocument.renderNodes[0]);
        assertInstanceOf(BladeEchoNode, truthDocument.renderNodes[1]);
        const echoOne = truthDocument.renderNodes[1] as BladeEchoNode;
        assert.strictEqual(echoOne.sourceContent, "{{ $user->name }}");
        assertInstanceOf(LiteralNode, truthDocument.renderNodes[2]);
        assertLiteralContent("</li>\n\n    ", truthDocument.renderNodes[2]);
        assertInstanceOf(ForElseNode, truthDocument.renderNodes[3]);
        assertInstanceOf(LiteralNode, truthDocument.renderNodes[4]);
        assertLiteralContent("\n", truthDocument.renderNodes[4]);

        const forElseTwo = truthDocument.renderNodes[3] as ForElseNode;
        assertCount(1, forElseTwo.falseNodes);
        assertCount(3, forElseTwo.truthNodes);
        assertNotNull(forElseTwo.truthDocument);
        assertNotNull(forElseTwo.falseDocument);

        const truthDocument2 = forElseTwo.truthDocument as ChildDocument,
            falseDocument2 = forElseTwo.falseDocument as ChildDocument;

        assertCount(1, falseDocument2.renderNodes);
        assertInstanceOf(LiteralNode, falseDocument2.renderNodes[0]);
        assertLiteralContent("\n    <p>No users2</p>\n    ", falseDocument2.renderNodes[0]);

        assertCount(3, truthDocument2.renderNodes);
        assertInstanceOf(LiteralNode, truthDocument2.renderNodes[0]);
        assertLiteralContent("\n    <li>", truthDocument2.renderNodes[0]);
        assertInstanceOf(BladeEchoNode, truthDocument2.renderNodes[1]);
        const echo2 = truthDocument2.renderNodes[1] as BladeEchoNode;
        assert.strictEqual(echo2.sourceContent, "{{ $user2->name }}");

        assertInstanceOf(LiteralNode, truthDocument2.renderNodes[2]);
        assertLiteralContent("</li>\n    ", truthDocument2.renderNodes[2]);
    });
});