import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { assertCount, assertPosition } from './testUtils/assertions.js';

suite('Fragments Parsing', () => {
    test('it parses basic fragments', () => {
        const fragments = BladeDocument.fromText(`
{{ $title < $total }}

<i class="something" />

<div class="container">
    Hello, {{ name }}.
</div>
`).getFragments();
        assertCount(3, fragments);
        const f1 = fragments[0],
            f2 = fragments[1],
            f3 = fragments[2];

        assert.strictEqual(f1.name, 'i');
        assertPosition(f1.startPosition, 4, 1);
        assertPosition(f1.endPosition, 4, 23);
        assert.strictEqual(f1.isClosingFragment, false);
        assert.strictEqual(f1.isSelfClosing, true);
        assertCount(1, f1.parameters);

        assert.strictEqual(f2.name, 'div');
        assertPosition(f2.startPosition, 6, 1);
        assertPosition(f2.endPosition, 6, 23);
        assert.strictEqual(f2.isClosingFragment, false);
        assert.strictEqual(f2.isSelfClosing, false);
        assertCount(1, f2.parameters);

        assert.strictEqual(f3.name, 'div');
        assertPosition(f3.startPosition, 8, 1);
        assertPosition(f3.endPosition, 8, 6);
        assert.strictEqual(f3.isClosingFragment, true);
        assert.strictEqual(f3.isSelfClosing, false);
        assertCount(0, f3.parameters);
    });

    test('lone < does not break parser', () => {
        const fragments = BladeDocument.fromText(`
{{ $title < $total }}

<i class="something" />

<

<div class="container">
    Hello, {{ name }}.
</div>
`).getFragments();
        assertCount(3, fragments);
        const f1 = fragments[0],
            f2 = fragments[1],
            f3 = fragments[2];

        assert.strictEqual(f1.name, 'i');
        assertPosition(f1.startPosition, 4, 1);
        assertPosition(f1.endPosition, 4, 23);
        assert.strictEqual(f1.isClosingFragment, false);
        assert.strictEqual(f1.isSelfClosing, true);
        assertCount(1, f1.parameters);

        assert.strictEqual(f2.name, 'div');
        assertPosition(f2.startPosition, 8, 1);
        assertPosition(f2.endPosition, 8, 23);
        assert.strictEqual(f2.isClosingFragment, false);
        assert.strictEqual(f2.isSelfClosing, false);
        assertCount(1, f2.parameters);

        assert.strictEqual(f3.name, 'div');
        assertPosition(f3.startPosition, 10, 1);
        assertPosition(f3.endPosition, 10, 6);
        assert.strictEqual(f3.isClosingFragment, true);
        assert.strictEqual(f3.isSelfClosing, false);
        assertCount(0, f3.parameters);
    });

    test('fragments with script tags', () => {
        const fragments = BladeDocument.fromText(`
{{ $title < $total }}

<i class="something" />

<script src="something/here.js" />
<script>

    if (5 < 3 || 5 < 1 || 1 < 3) {
        console.log('this <<<<<<<<');
    }
</script>

<div class="container">
    Hello, {{ name }}.
</div>
`).getFragments();
        assertCount(6, fragments);

        const f1 = fragments[0],
            f2 = fragments[1],
            f3 = fragments[2],
            f4 = fragments[3],
            f5 = fragments[4],
            f6 = fragments[5];

        assert.strictEqual(f1.name, 'i');
        assertPosition(f1.startPosition, 4, 1);
        assertPosition(f1.endPosition, 4, 23);
        assert.strictEqual(f1.isClosingFragment, false);
        assert.strictEqual(f1.isSelfClosing, true);
        assertCount(1, f1.parameters);

        assert.strictEqual(f2.name, 'script');
        assertPosition(f2.startPosition, 6, 1);
        assertPosition(f2.endPosition, 6, 34);
        assert.strictEqual(f2.isClosingFragment, false);
        assert.strictEqual(f2.isSelfClosing, true);
        assertCount(1, f2.parameters);

        assert.strictEqual(f3.name, 'script');
        assertPosition(f3.startPosition, 7, 1);
        assertPosition(f3.endPosition, 7, 8);
        assert.strictEqual(f3.isClosingFragment, false);
        assert.strictEqual(f3.isSelfClosing, false);
        assertCount(0, f3.parameters);

        assert.strictEqual(f4.name, 'script');
        assertPosition(f4.startPosition, 12, 1);
        assertPosition(f4.endPosition, 12, 9);
        assert.strictEqual(f4.isClosingFragment, true);
        assert.strictEqual(f4.isSelfClosing, false);
        assertCount(0, f4.parameters);

        assert.strictEqual(f5.name, 'div');
        assertPosition(f5.startPosition, 14, 1);
        assertPosition(f5.endPosition, 14, 23);
        assert.strictEqual(f5.isClosingFragment, false);
        assert.strictEqual(f5.isSelfClosing, false);
        assertCount(1, f5.parameters);

        assert.strictEqual(f6.name, 'div');
        assertPosition(f6.startPosition, 16, 1);
        assertPosition(f6.endPosition, 16, 6);
        assert.strictEqual(f6.isClosingFragment, true);
        assert.strictEqual(f6.isSelfClosing, false);
        assertCount(0, f6.parameters);
    });
});