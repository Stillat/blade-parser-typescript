import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Component Tags', () => {
    test('it formats simple component tags', () => {
        assert.strictEqual(
            formatBladeString(`        <x-icon 
            @class([$icon, 'pe-2'])
                        />`).trim(),
            `<x-icon @class([$icon, "pe-2"]) />`
        );
    });

    test('it can format component tag pairs', () => {
        assert.strictEqual(
            formatBladeString(`    <x-icon 
            @class([$icon, 'pe-2'])
                        >
<div>
<p>test</p>
</div>
                    </x-icon>`).trim(),
            `<x-icon @class([$icon, "pe-2"])>
    <div>
        <p>test</p>
    </div>
</x-icon>`
        );
    });

    test('it can format slots with names', () => {
        assert.strictEqual(
            formatBladeString(`<x-slot:name

            param="value" />`).trim(),
            `<x-slot:name param="value" />`
        );
    });

    test('it normalizes inline names', () => {
        assert.strictEqual(
            formatBladeString(`<x:slot:name

            param="value" />`).trim(),
            `<x-slot:name param="value" />`
        );
    });

    test('it normalizes inline name pairs', () => {
        assert.strictEqual(
            formatBladeString(`<x:slot:name

            param="value">
   <p>Content</p>
            </x:slot:name>`).trim(),
            `<x-slot:name param="value">
    <p>Content</p>
</x-slot>`
        );
    });

    test('it normalizes names', () => {
        assert.strictEqual(
            formatBladeString(`<x:slot:name />`).trim(),
            `<x-slot:name />`
        );
    });

    test('it formats dot names', () => {
        assert.strictEqual(
            formatBladeString(`<x-inputs.button 
            class="something" />`).trim(),
            `<x-inputs.button class="something" />`
        );
    });

    test('it formats params and bindings', () => {
        assert.strictEqual(
            formatBladeString(`<x-alert            type="error"


 :message="$message" />`).trim(),
            `<x-alert type="error" :message="$message" />`
        );
    });

    test('it formats escaped parameter bindings', () => {
        assert.strictEqual(
            formatBladeString(`<x-button                   

            
            ::class="{ danger: isDeleting }">
                           Submit
                       </x-button>`).trim(),
            `<x-button ::class="{ danger: isDeleting }">Submit</x-button>`
        );
    });

    test('it formats json bindings', () => {
        assert.strictEqual(
            formatBladeString(`<button :class="{ danger: isDeleting }">
            Submit
        </button>`).trim(),
            `<button :class="{ danger: isDeleting }">Submit</button>`
        );
    });

    test('it formats inline echos', () => {
        assert.strictEqual(
            formatBladeString(`<option 
                        {{ $isSelected($value) ? 'selected="selected"' : '' }} value="{{ $value }}">
                  {{ $label }}
        </option>`).trim(),
            `<option
    {{ $isSelected($value) ? 'selected="selected"' : "" }}
    value="{{ $value }}"
>
    {{ $label }}
</option>`
        );
    });

    test('it formats attributes', () => {
        assert.strictEqual(
            formatBladeString(`<div {{ $attributes }}>
        <!-- Component content -->
    </div>`).trim(),
        `<div {{ $attributes }}>
    <!-- Component content -->
</div>`
        );
    });

    test('it formats merged attributes', () => {
        assert.strictEqual(
            formatBladeString(`<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}
        >
                    {{ $message }}
            </div>`).trim(),
        `<div
    {{ $attributes->merge(["class" => "alert alert-" . $type]) }}
>
    {{ $message }}
</div>`
        );
    });

    test('it formats conditionally merged attributes', () => {
        assert.strictEqual(
            formatBladeString(`<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
            {{ $message }}
        </div>`).trim(),
            `<div {{ $attributes->class(["p-4", "bg-red" => $hasError]) }}>
    {{ $message }}
</div>`
        );
    });

    test('it formats chained merged attributes', () => {
        assert.strictEqual(
            formatBladeString(`<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
            {{ $slot }}
        </button>`).trim(),
            `<button {{ $attributes->class(["p-4"])->merge(["type" => "button"]) }}>
    {{ $slot }}
</button>`
        );
    });

    test('it preserves inline attributes params echos and directives', () => {
        assert.strictEqual(
            formatBladeString(`<x-alert attribute param="{{ $title }}" {{ $title }} @directiveName @directiveWithParams('test') />`).trim(),
            `<x-alert
    attribute
    param="{{ $title }}"
    {{ $title }}
    @directiveName
    @directiveWithParams("test")
/>`
        );
    });

    test('it can format PHP inside directive parameters', () => {
        assert.strictEqual(
            formatBladeString(`
            <x-alert @param($value    + $anotherValue) />`).trim(),
            `<x-alert @param($value + $anotherValue) />`
        );
    });

    test('it preservies invalid PHP inside directive parameters', () => {
        assert.strictEqual(
            formatBladeString(`
            <x-alert @param($value   $= + $anotherValue) />`).trim(),
            `<x-alert @param($value   $= + $anotherValue) />`
        );
    });

    test('it can rewrite slots to not break HTML tag pairs', () => {
        assert.strictEqual(
            formatBladeString(`<x-alert>
            <x-slot:title>
                Server Error
            </x-slot>
         
            <strong>Whoops!</strong> Something went wrong!
        </x-alert>`).trim(),
            `<x-alert>
    <x-slot:title>Server Error</x-slot>

    <strong>Whoops!</strong>
    Something went wrong!
</x-alert>`
        );     
    });

    test('it can format attribute short syntax', () => {
        const template = `<x-profile :$userId :$size></x-profile>`;
        const result = formatBladeString(template);

        assert.strictEqual(result.trim(), template);
    });

    test('it preserves inline echo', () => {
        const input = `<x-filament::avatar
        :src="filament()->getTenantAvatarUrl($tenant)"
        {{ $attributes }}
        />`;
        const out = `<x-filament::avatar
    :src="filament()->getTenantAvatarUrl($tenant)"
    {{ $attributes }}
/>
`;
        assert.strictEqual(formatBladeString(input), out);
        assert.strictEqual(formatBladeString(out), out);
    });

    test('it preserves comments', () => {
        const input = `<x-foo {{-- foo="" --}} />`;
        const out = `<x-foo {{-- foo="" --}} />
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it does not break @click.prevent directive', () => {
        const input = `<x-jet-dropdown-link
    href="{{ route('logout') }}"
    @click.prevent="$root.submit();"
>
    {{ __('Log Out') }}
</x-jet-dropdown-link>`;
        const out = `<x-jet-dropdown-link
    href="{{ route('logout') }}"
    @click.prevent="$root.submit();"
>
    {{ __("Log Out") }}
</x-jet-dropdown-link>
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it can format inline slot names', () => {
        const input = `
<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title>
    {{ __('My Title') }}
    <x-slot:title>
    {{ __('My Title') }}
</x-slot>

<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title-two>
    {{ __('My Title') }}
    <x-slot:title-three>
    {{ __('My Title') }}
    <x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title>
    {{ __('My Title') }}
    <x-slot:title>
    {{ __('My Title') }}
</x-slot>

<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title-two>
    {{ __('My Title') }}
    <x-slot:title-three>
    {{ __('My Title') }}
</x-slot>
<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title>
    {{ __('My Title') }}
    <x-slot:title>
    {{ __('My Title') }}
</x-slot>

</x-slot>

<x-slot:title>
    {{ __('My Title') }}
    <x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title>
    {{ __('My Title') }}
    <x-slot:title>
    {{ __('My Title') }}
</x-slot>

<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title-two>
    {{ __('My Title') }}
    <x-slot:title-three>
    {{ __('My Title') }}
</x-slot>
<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title>
    {{ __('My Title') }}
    <x-slot:title>
    {{ __('My Title') }}
</x-slot>

</x-slot>

<x-slot:title>
    {{ __('My Title') }}
</x-slot>
</x-slot>

<x-slot:title-four>
    {{ __('My Title') }}
</x-slot>

</x-slot>

<x-slot:title>
    {{ __('My Title') }}
</x-slot>
</x-slot>
</x-slot>

<x-slot:title-four>
    {{ __('My Title') }}
</x-slot>

</x-slot>

<x-slot:title>
    {{ __('My Title') }}
</x-slot>
</x-slot>
<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title>
    {{ __('My Title') }}
    <x-slot:title>
    {{ __('My Title') }}
</x-slot>

</x-slot>

<x-slot:title>
    {{ __('My Title') }}
</x-slot>
</x-slot>

<x-slot:title-four>
    {{ __('My Title') }}
</x-slot>

</x-slot>

<x-slot:title>
    {{ __('My Title') }}
</x-slot>`;
        const output = `<x-slot name="title">
    <p>Howdy, sir.</p>
</x-slot>

<x-slot:title>
    {{ __("My Title") }}
    <x-slot:title>
        {{ __("My Title") }}
    </x-slot>

    <x-slot name="title">
        <p>Howdy, sir.</p>
    </x-slot>

    <x-slot:title-two>
        {{ __("My Title") }}
        <x-slot:title-three>
            {{ __("My Title") }}
            <x-slot name="title">
                <p>Howdy, sir.</p>
            </x-slot>

            <x-slot:title>
                {{ __("My Title") }}
                <x-slot:title>
                    {{ __("My Title") }}
                </x-slot>

                <x-slot name="title">
                    <p>Howdy, sir.</p>
                </x-slot>

                <x-slot:title-two>
                    {{ __("My Title") }}
                    <x-slot:title-three>
                        {{ __("My Title") }}
                    </x-slot>
                    <x-slot name="title">
                        <p>Howdy, sir.</p>
                    </x-slot>

                    <x-slot:title>
                        {{ __("My Title") }}
                        <x-slot:title>
                            {{ __("My Title") }}
                        </x-slot>
                    </x-slot>

                    <x-slot:title>
                        {{ __("My Title") }}
                        <x-slot name="title">
                            <p>Howdy, sir.</p>
                        </x-slot>

                        <x-slot:title>
                            {{ __("My Title") }}
                            <x-slot:title>
                                {{ __("My Title") }}
                            </x-slot>

                            <x-slot name="title">
                                <p>Howdy, sir.</p>
                            </x-slot>

                            <x-slot:title-two>
                                {{ __("My Title") }}
                                <x-slot:title-three>
                                    {{ __("My Title") }}
                                </x-slot>
                                <x-slot name="title">
                                    <p>Howdy, sir.</p>
                                </x-slot>

                                <x-slot:title>
                                    {{ __("My Title") }}
                                    <x-slot:title>
                                        {{ __("My Title") }}
                                    </x-slot>
                                </x-slot>

                                <x-slot:title>
                                    {{ __("My Title") }}
                                </x-slot>
                            </x-slot>

                            <x-slot:title-four>
                                {{ __("My Title") }}
                            </x-slot>
                        </x-slot>

                        <x-slot:title>
                            {{ __("My Title") }}
                        </x-slot>
                    </x-slot>
                </x-slot>

                <x-slot:title-four>
                    {{ __("My Title") }}
                </x-slot>
            </x-slot>

            <x-slot:title>
                {{ __("My Title") }}
            </x-slot>
        </x-slot>
        <x-slot name="title">
            <p>Howdy, sir.</p>
        </x-slot>

        <x-slot:title>
            {{ __("My Title") }}
            <x-slot:title>
                {{ __("My Title") }}
            </x-slot>
        </x-slot>

        <x-slot:title>
            {{ __("My Title") }}
        </x-slot>
    </x-slot>

    <x-slot:title-four>
        {{ __("My Title") }}
    </x-slot>
</x-slot>

<x-slot:title>
    {{ __("My Title") }}
</x-slot>
`;
        assert.strictEqual(formatBladeString(input), output);
    });
});