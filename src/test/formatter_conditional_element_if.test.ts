import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Conditional Element If Statements', () => {
    test('it can detect and format conditional if statements as HTML tags', async () => {
        assert.strictEqual(
            (await formatBladeString(`                        <@if($something)here @endif class="something">
    <div><p>SOme {{ $text }} text</p>
                            <@if($something)here @endif class="something">
    <div><p>SOme {{ $text }} text</p>
</div>
        </@if($something)here @endif>
</div>
        </@if($something)here @endif>`)).trim(),
            `<@if($something)here @endif class="something">
    <div>
        <p>SOme {{ $text }} text</p>
        <@if($something)here @endif class="something">
            <div><p>SOme {{ $text }} text</p></div>
        </@if($something)here @endif>
    </div>
</@if($something)here @endif>`
        );
    });

    test('it does not format exact matches as dynamic HTML', async () => {
        assert.strictEqual(
            (await formatBladeString(`                       <@if($something)here @endif class="something">
            <div><p>SOme {{ $text }} text</p>
                                    <@if($something)here @endif class="something">
            <div><p>SOme {{ $text }} text</p>
        
            @if($something)here @endif
        </div>
                </@if($something)here @endif>
        </div>
                </@if($something)here @endif>`)).trim(),
            `<@if($something)here @endif class="something">
    <div>
        <p>SOme {{ $text }} text</p>
        <@if($something)here @endif class="something">
            <div>
                <p>SOme {{ $text }} text</p>

                @if ($something)
                    here
                @endif
            </div>
        </@if($something)here @endif>
    </div>
</@if($something)here @endif>`
        );
    });
});