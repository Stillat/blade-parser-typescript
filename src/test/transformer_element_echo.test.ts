import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Element Echo Transformer', () => {
    test('it transforms echo elements', async () => {
        assert.strictEqual(
            (await transformString(`<{{ $element }} class="something">
<div><p>SOme {{ $element }} text</p>
<{{ $element }} class="something">
<div><p>SOme {{ $element }} text</p>
</div>
    </{{ $element }}>
</div>
    </{{ $element }}>`)).trim(),
            `<{{ $element }} class="something">
<div><p>SOme {{ $element }} text</p>
<{{ $element }} class="something">
<div><p>SOme {{ $element }} text</p>
</div>
    </{{ $element }}>
</div>
    </{{ $element }}>`
        );
    });

    test('it transforms echo elements with {{{', async () => {
        assert.strictEqual(
            (await transformString(`<{{{ $element }}} class="something">
<div><p>SOme {{{ $element }}} text</p>
<{{{ $element }}} class="something">
<div><p>SOme {{{ $element }}} text</p>
</div>
    </{{{ $element }}}>
</div>
    </{{{ $element }}}>`)).trim(),
            `<{{{ $element }}} class="something">
<div><p>SOme {{{ $element }}} text</p>
<{{{ $element }}} class="something">
<div><p>SOme {{{ $element }}} text</p>
</div>
    </{{{ $element }}}>
</div>
    </{{{ $element }}}>`
        );
    });

    test('it transforms echo elements with {!!', async () => {
        assert.strictEqual(
            (await transformString(`<{!! $element !!} class="something">
<div><p>SOme {!! $element !!} text</p>
<{!! $element !!} class="something">
<div><p>SOme {!! $element !!} text</p>
</div>
    </{!! $element !!}>
</div>
    </{!! $element !!}>`)).trim(),
            `<{!! $element !!} class="something">
<div><p>SOme {!! $element !!} text</p>
<{!! $element !!} class="something">
<div><p>SOme {!! $element !!} text</p>
</div>
    </{!! $element !!}>
</div>
    </{!! $element !!}>`
        );
    });
});