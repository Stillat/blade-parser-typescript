import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { BladeEchoNode, DirectiveNode } from '../nodes/nodes.js';

suite('Fragments Style and Script Labeling', () => {
    test('it labels nodes inside style and script tags', () => {
        const nodes = BladeDocument.fromText(`
<html>
<style>
    .thing {
        background-color: {{ $color }}
    }
</style>
{{ $color }}
<style>
    .thing {
        background-color: {{ $color }}
    }
</style>
<body>

<script>
var test = @js('something')
</script>
@js('something')
<script>
var test = @js('something')
</script>
</body>

</html>`).getAllNodes();
        const echo1 = nodes[1] as BladeEchoNode,
            echo2 = nodes[3] as BladeEchoNode,
            echo3 = nodes[5] as BladeEchoNode,
            directive1 = nodes[7] as DirectiveNode,
            directive2 = nodes[9] as DirectiveNode,
            directive3 = nodes[11] as DirectiveNode;

        assert.strictEqual(echo1.isInScriptTag, false);
        assert.strictEqual(echo1.isInStyleTag, true);

        assert.strictEqual(echo2.isInScriptTag, false);
        assert.strictEqual(echo2.isInStyleTag, false);

        assert.strictEqual(echo3.isInScriptTag, false);
        assert.strictEqual(echo3.isInStyleTag, true);

        assert.strictEqual(directive1.isInScriptTag, true);
        assert.strictEqual(directive1.isInStyleTag, false);

        assert.strictEqual(directive2.isInScriptTag, false);
        assert.strictEqual(directive2.isInStyleTag, false);

        assert.strictEqual(directive3.isInScriptTag, true);
        assert.strictEqual(directive3.isInStyleTag, false);
    });
});