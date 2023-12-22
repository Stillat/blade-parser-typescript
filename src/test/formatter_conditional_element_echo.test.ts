import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Conditional Element Echo', () => {
    test('it detects and formats conditional elements', async () => {
        assert.strictEqual(
            (await formatBladeString(`                        <{{ $element }} class="something">
            <div><p>SOme {{ $element }} text</p>
        </div>
                </{{ $element }}>`)).trim(),
            `<{{ $element }} class="something">
    <div><p>SOme {{ $element }} text</p></div>
</{{ $element }}>`
        );
    });

    test('it can format nested conditional elements', async () => {
        assert.strictEqual(
            (await formatBladeString(`                        <{{ $element }} class="something">
            <div><p>SOme {{ $element }} text</p>
                                    <{{ $element }} class="something">
            <div><p>SOme {{ $element }} text</p>
        </div>
                </{{ $element }}>
        </div>
                </{{ $element }}>`)).trim(),
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

    test('it can format dynamic elements with {{{', async () => {
        assert.strictEqual(
            (await formatBladeString(`                        <{{{ $element }}} class="something">
            <div><p>SOme {{{ $element }}} text</p>
                                    <{{{ $element }}} class="something">
            <div><p>SOme {{{ $element }}} text</p>
        </div>
                </{{{ $element }}}>
        </div>
                </{{{ $element }}}>`)).trim(),
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

    test('it can format dynamic elements with {!!', async () => {
        assert.strictEqual(
            (await formatBladeString(`                        <{!! $element !!} class="something">
    <div><p>SOme {!! $element !!} text</p>
                            <{!! $element !!} class="something">
    <div><p>SOme {!! $element !!} text</p>
</div>
        </{!! $element !!}>
</div>
        </{!! $element !!}>`)).trim(),
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