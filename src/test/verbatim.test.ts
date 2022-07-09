import assert = require('assert');
import { BladeDocument } from '../document/bladeDocument';
import { DirectiveNode, LiteralNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf, assertLiteralContent } from './testUtils/assertions';

suite('Verbatim Nodes', () => {
    test('verbatim does not create additional nodes', () => {
        const template = `
start @verbatim start

start
{{-- comment!!! --}}3
s1@props-two(['color' => (true ?? 'gray')])
s2@directive
@directive something
s3@props-three  (['color' => (true ?? 'gray')])
@props(['color' => 'gray'])
{!! $dooblyDoo !!}1
<ul {{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}>
{{ $slot }}
</ul>

end @endverbatim end

`,
            document = BladeDocument.fromText(template),
            nodes = document.getAllNodes();

        assertCount(4, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(DirectiveNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);
        assertInstanceOf(LiteralNode, nodes[3]);

        const verbatimOpen = nodes[1] as DirectiveNode,
            verbatimClose = nodes[2] as DirectiveNode;

        assert.strictEqual(verbatimOpen.directiveName, 'verbatim');
        assert.strictEqual(verbatimOpen.sourceContent, '@verbatim');
        assert.strictEqual(verbatimClose.directiveName, 'endverbatim');
        assert.strictEqual(verbatimClose.sourceContent, '@endverbatim');

        assert.strictEqual(verbatimOpen.innerContent, " start\n\nstart\n{{-- comment!!! --}}3\ns1@props-two(['color' => (true ?? 'gray')])\ns2@directive\n@directive something\ns3@props-three  (['color' => (true ?? 'gray')])\n@props(['color' => 'gray'])\n{!! $dooblyDoo !!}1\n<ul {{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}>\n{{ $slot }}\n</ul>\n\nend ");

        assertLiteralContent("\nstart ", nodes[0]);
        assertLiteralContent("end\n\n", nodes[3]);
    });
});