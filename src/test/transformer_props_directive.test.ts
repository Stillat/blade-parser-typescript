import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Props Transformer', () => {
    test('it can transform documents with props', () => {
        assert.strictEqual(
            transformString(`<x-icon


:class="Arr::toCssClasses(['...'])" 




/>

@props(

[           'icon'



]


)

<div>
<x-icon                      @class([$icon,              'pe-2'] )
/>
{{ $slot }}




</div>`).trim(),
            `<x-icon :class="Arr::toCssClasses(['...'])"  />



@props(

[           'icon'



]


)

<div>
<x-icon @class([$icon,              'pe-2'] )  />
{{ $slot }}




</div>`
        );
    });
});