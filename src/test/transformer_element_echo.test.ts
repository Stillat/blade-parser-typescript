import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Element Echo Transformer', () => {
    test('it transforms echo elements', () => {
        assert.strictEqual(
            transformString(`<{{ $element }} class="something">
<div><p>SOme {{ $element }} text</p>
<{{ $element }} class="something">
<div><p>SOme {{ $element }} text</p>
</div>
    </{{ $element }}>
</div>
    </{{ $element }}>`).trim(),
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

    test('it transforms echo elements with {{{', () => {
        assert.strictEqual(
            transformString(`<{{{ $element }}} class="something">
<div><p>SOme {{{ $element }}} text</p>
<{{{ $element }}} class="something">
<div><p>SOme {{{ $element }}} text</p>
</div>
    </{{{ $element }}}>
</div>
    </{{{ $element }}}>`).trim(),
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

    test('it transforms echo elements with {!!', () => {
        assert.strictEqual(
            transformString(`<{!! $element !!} class="something">
<div><p>SOme {!! $element !!} text</p>
<{!! $element !!} class="something">
<div><p>SOme {!! $element !!} text</p>
</div>
    </{!! $element !!}>
</div>
    </{!! $element !!}>`).trim(),
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