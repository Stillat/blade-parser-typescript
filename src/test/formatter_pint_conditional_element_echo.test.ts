import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Conditional Element Echo', () => {
    test('pint: it detects and formats conditional elements', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`                        <{{ $element }} class="something">
            <div><p>SOme {{ $element }} text</p>
        </div>
                </{{ $element }}>`).trim(),
            `<{{ $element }} class="something">
    <div><p>SOme {{ $element }} text</p></div>
</{{ $element }}>`
        );
    });

    test('pint: it can format nested conditional elements', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`                        <{{ $element }} class="something">
            <div><p>SOme {{ $element }} text</p>
                                    <{{ $element }} class="something">
            <div><p>SOme {{ $element }} text</p>
        </div>
                </{{ $element }}>
        </div>
                </{{ $element }}>`).trim(),
            `<{{ $element }} class="something">
    <div>
        <p>SOme {{ $element }} text</p>
        <{{ $element }} class="something">
            <div><p>SOme {{ $element }} text</p></div>
        </{{ $element }}>
    </div>
</{{ $element }}>`
        );
    });

    test('pint: it can format dynamic elements with {{{', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`                        <{{{ $element }}} class="something">
            <div><p>SOme {{{ $element }}} text</p>
                                    <{{{ $element }}} class="something">
            <div><p>SOme {{{ $element }}} text</p>
        </div>
                </{{{ $element }}}>
        </div>
                </{{{ $element }}}>`).trim(),
            `<{{{ $element }}} class="something">
    <div>
        <p>SOme {{{ $element }}} text</p>
        <{{{ $element }}} class="something">
            <div><p>SOme {{{ $element }}} text</p></div>
        </{{{ $element }}}>
    </div>
</{{{ $element }}}>`
        );
    });

    test('pint: it can format dynamic elements with {!!', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`                        <{!! $element !!} class="something">
    <div><p>SOme {!! $element !!} text</p>
                            <{!! $element !!} class="something">
    <div><p>SOme {!! $element !!} text</p>
</div>
        </{!! $element !!}>
</div>
        </{!! $element !!}>`).trim(),
            `<{!! $element !!} class="something">
    <div>
        <p>SOme {!! $element !!} text</p>
        <{!! $element !!} class="something">
            <div><p>SOme {!! $element !!} text</p></div>
        </{!! $element !!}>
    </div>
</{!! $element !!}>`
        );
    });
});