import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { FragmentNode } from '../nodes/nodes.js';

suite('Fragment Structures', () => {
    test('it can detect when <style> and <script> contain structures', () => {
        const nodes = BladeDocument.fromText(`
<html>
<style>
    .thing {
        background-color: @foreach ($something as $somethingElse)
            {{ $thing}}
        @endforeach
    }
</style>

<style></style>
<body>


<script>
    var app = '@if ($something) something @else something-else @endif'.trim();
</script>

<script></script>

</body>

</html>`).getParser().getFragments();
        const style1 = nodes[1] as FragmentNode,
            style2 = nodes[3] as FragmentNode,
            script1 = nodes[6] as FragmentNode,
            script2 = nodes[8] as FragmentNode;

        assert.strictEqual(style1.name, 'style');
        assert.strictEqual(style1.containsStructures, true);
        assert.strictEqual(style2.name, 'style');
        assert.strictEqual(style2.containsStructures, false);

        assert.strictEqual(script1.name, 'script');
        assert.strictEqual(script1.containsStructures, true);
        assert.strictEqual(script2.name, 'script');
        assert.strictEqual(script2.containsStructures, false);
    });
});