import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Component Tags', () => {
    test('pint: it formats simple component tags', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`        <x-icon 
            @class([$icon, 'pe-2'])
                        />`)).trim(),
            `<x-icon @class([$icon, 'pe-2']) />`
        );
    });

    test('pint: it can format component tag pairs', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`    <x-icon 
            @class([$icon, 'pe-2'])
                        >
<div>
<p>test</p>
</div>
                    </x-icon>`)).trim(),
            `<x-icon @class([$icon, 'pe-2'])>
    <div>
        <p>test</p>
    </div>
</x-icon>`
        );
    });

    test('pint: it can format slots with names', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-slot:name

            param="value" />`)).trim(),
            `<x-slot:name param="value" />`
        );
    });

    test('pint: it normalizes inline names', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x:slot:name

            param="value" />`)).trim(),
            `<x-slot:name param="value" />`
        );
    });

    test('pint: it normalizes inline name pairs', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x:slot:name

            param="value">
   <p>Content</p>
            </x:slot:name>`)).trim(),
            `<x-slot:name param="value">
    <p>Content</p>
</x-slot>`
        );
    });

    test('pint: it normalizes names', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x:slot:name />`)).trim(),
            `<x-slot:name />`
        );
    });

    test('pint: it formats dot names', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-inputs.button 
            class="something" />`)).trim(),
            `<x-inputs.button class="something" />`
        );
    });

    test('pint: it formats params and bindings', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-alert            type="error"


 :message="$message" />`)).trim(),
            `<x-alert type="error" :message="$message" />`
        );
    });

    test('pint: it formats escaped parameter bindings', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-button                   

            
            ::class="{ danger: isDeleting }">
                           Submit
                       </x-button>`)).trim(),
            `<x-button ::class="{ danger: isDeleting }">Submit</x-button>`
        );
    });

    test('pint: it formats json bindings', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<button :class="{ danger: isDeleting }">
            Submit
        </button>`)).trim(),
            `<button :class="{ danger: isDeleting }">Submit</button>`
        );
    });

    test('pint: it formats inline echos', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<option 
                        {{ $isSelected($value) ? 'selected="selected"' : '' }} value="{{ $value }}">
                  {{ $label }}
        </option>`)).trim(),
            `<option
    {{ $isSelected($value) ? 'selected="selected"' : '' }}
    value="{{ $value }}"
>
    {{ $label }}
</option>`
        );
    });

    test('pint: it formats attributes', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div {{ $attributes }}>
        <!-- Component content -->
    </div>`)).trim(),
        `<div {{ $attributes }}>
    <!-- Component content -->
</div>`
        );
    });

    test('pint: it formats merged attributes', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}
        >
                    {{ $message }}
            </div>`)).trim(),
        `<div
    {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}
>
    {{ $message }}
</div>`
        );
    });

    test('pint: it formats conditionally merged attributes', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
            {{ $message }}
        </div>`)).trim(),
            `<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
    {{ $message }}
</div>`
        );
    });

    test('pint: it formats chained merged attributes', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
            {{ $slot }}
        </button>`)).trim(),
            `<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>`
        );
    });

    test('pint: it preserves inline attributes params echos and directives', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-alert attribute param="{{ $title }}" {{ $title }} @directiveName @directiveWithParams('test') />`)).trim(),
            `<x-alert
    attribute
    param="{{ $title }}"
    {{ $title }}
    @directiveName
    @directiveWithParams('test')
/>`
        );
    });

    test('pint: it can format PHP inside directive parameters', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`
            <x-alert @param($value    + $anotherValue) />`)).trim(),
            `<x-alert @param($value + $anotherValue) />`
        );
    });

    test('pint: it preservies invalid PHP inside directive parameters', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`
            <x-alert @param($value   $= + $anotherValue) />`)).trim(),
            `<x-alert @param($value   $= + $anotherValue) />`
        );
    });

    test('pint: it can rewrite slots to not break HTML tag pairs', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-alert>
            <x-slot:title>
                Server Error
            </x-slot>
         
            <strong>Whoops!</strong> Something went wrong!
        </x-alert>`)).trim(),
            `<x-alert>
    <x-slot:title>Server Error</x-slot>

    <strong>Whoops!</strong>
    Something went wrong!
</x-alert>`
        );     
    });

    test('pint: it can format attribute short syntax', async () => {
        const template = `<x-profile :$userId :$size></x-profile>`;
        const result = await formatBladeStringWithPint(template);

        assert.strictEqual(result.trim(), template);
    });

    test('pint: it preserves inline echo', async () => {
        const input = `<x-filament::avatar
        :src="filament()->getTenantAvatarUrl($tenant)"
        {{ $attributes }}
        />`;
        const out = `<x-filament::avatar
    :src="filament()->getTenantAvatarUrl($tenant)"
    {{ $attributes }}
/>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
        assert.strictEqual(await formatBladeStringWithPint(out), out);
    });
});