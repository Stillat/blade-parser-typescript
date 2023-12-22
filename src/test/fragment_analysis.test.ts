import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { BladeEchoNode, ConditionNode, DirectiveNode, FragmentPosition } from '../nodes/nodes.js';
import { assertCount, assertInstanceOf } from './testUtils/assertions.js';

suite('Fragment Analysis', () => {
    test('it identifies dynamic opening', () => {
        const nodes = BladeDocument.fromText(`<{{ $tagName }}>

</{{ $tagName }}>`).getAllNodes();
        assertCount(5, nodes);
        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertInstanceOf(BladeEchoNode, nodes[3]);

        const echo1 = nodes[1] as BladeEchoNode,
            echo2 = nodes[3] as BladeEchoNode;

        assert.strictEqual(echo1.fragmentPosition, FragmentPosition.IsDynamicFragmentName);
        assert.strictEqual(echo2.fragmentPosition, FragmentPosition.IsDynamicFragmentName);
    });

    test('it identifies parameters', () => {
        const nodes = BladeDocument.fromText(`<div class="something {{ $here }}">

</div>`).getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(BladeEchoNode, nodes[1]);

        const echo = nodes[1] as BladeEchoNode;
        assert.strictEqual(echo.fragmentPosition, FragmentPosition.InsideFragmentParameter);
    });

    test('it identifies inside content', () => {
        const nodes = BladeDocument.fromText(`<div something {{ $here }}>

</div>`).getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(BladeEchoNode, nodes[1]);

        const echo = nodes[1] as BladeEchoNode;
        assert.strictEqual(echo.fragmentPosition, FragmentPosition.InsideFragment);
    });

    test('it identifies directive content', () => {
        const nodes = BladeDocument.fromText(`<div @class([])></div>`).getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(DirectiveNode, nodes[1]);

        const directive = nodes[1] as DirectiveNode;
        assert.strictEqual(directive.fragmentPosition, FragmentPosition.InsideFragment);
    });

    test('it identifies condition content', () => {
        const nodes = BladeDocument.fromText(`<div @if(true) yes @endif></div>`).getRenderNodes();
        assertCount(3, nodes);
        assertInstanceOf(ConditionNode, nodes[1]);

        const condition = nodes[1] as ConditionNode;
        assert.strictEqual(condition.fragmentPosition, FragmentPosition.InsideFragment);
    });
});