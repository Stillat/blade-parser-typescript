import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Switch Formatting', () => {
    test('it can format simple switch statements', () => {
        assert.strictEqual(
            formatBladeString(`
@switch($i)
    @case(1)
        First case...
        @break
    @case(2)
        Second case...
        @break
    @default



        Default case...
@endswitch`).trim(),
            `@switch($i)
    @case(1)
        First case...

        @break
    @case(2)
        Second case...

        @break
    @default
        Default case...
@endswitch`
        );
    });

    test('it can format leading switch nodes', () => {
        assert.strictEqual(
            formatBladeString(`
@switch($i)
{{-- Leading node test. --}}

<p>Test {{ $title}} 
</p>
@case(1)
First case...
@break
@case(2)
Second case...
@break
@default



Default case...
@endswitch`).trim(),
            `@switch($i)
    {{-- Leading node test. --}}

    <p>Test {{ $title }}</p>
    @case(1)
        First case...

        @break
    @case(2)
        Second case...

        @break
    @default
        Default case...
@endswitch`
        );
    });

    test('it can format switch with embedded HTML', () => {
        assert.strictEqual(
            formatBladeString(`
            @switch($i)
            {{-- Leading node test. --}}
            
            <p>Test {{ $title}} 
            </p>
            @case(1)
            <p>First case...</p>
            @break
            @case(2)
            <p>Second case...</p>
            @break
            @default
            
            
            
            <p>Default case...</p>
            @endswitch`).trim(),
            `@switch($i)
    {{-- Leading node test. --}}

    <p>Test {{ $title }}</p>
    @case(1)
        <p>First case...</p>

        @break
    @case(2)
        <p>Second case...</p>

        @break
    @default
        <p>Default case...</p>
@endswitch`
        );
    });

    test('it can format switch without breaks', () => {
        assert.strictEqual(
            formatBladeString(`
            @switch($i)
            
            @case(1)
            <p>First case...</p>
            @case(2)
            <p>Second case...</p>
            @default
            
            <p>Default case...</p>
            @endswitch`).trim(),
            `@switch($i)
    @case(1)
        <p>First case...</p>
    @case(2)
        <p>Second case...</p>
    @default
        <p>Default case...</p>
@endswitch`
        );
    });

    test('it can format switch without default', () => {
        assert.strictEqual(
            formatBladeString(`
            @switch($i)
            
            @case(1)
            <p>First case...</p>
            @case(2)
            <p>Second case...</p>
            @endswitch`).trim(),
            `@switch($i)
    @case(1)
        <p>First case...</p>
    @case(2)
        <p>Second case...</p>
@endswitch`
        );
    });

    test('it can format switch with no cases', () => {
        assert.strictEqual(
            formatBladeString(`
            @switch($i)
            <div>
            <p>Just testing
            </p>
            </div>
            @endswitch`).trim(),
            `@switch($i)
    <div>
        <p>Just testing</p>
    </div>
@endswitch`
        );
    });

    test('it can format switch with just default', () => {
        assert.strictEqual(
            formatBladeString(`
            @switch($i)
            
                                    @default
                                        <p>Default case...</p>
            @endswitch`).trim(),
            `@switch($i)
    @default
        <p>Default case...</p>
@endswitch`
        );
    });

    test('it can wrap to next line', () => {
        assert.strictEqual(
            formatBladeString(`@switch($i)
            {{-- Leading node test. --}}
            
            <p>Test {{ $title}} 
            </p>
            @case(1) <p>First case...</p> @break
            @case(2) <p>Second case...</p>
            @break @default 
            
            
            <p>Default case...</p>
            @endswitch`).trim(),
            `@switch($i)
    {{-- Leading node test. --}}

    <p>Test {{ $title }}</p>
    @case(1)
        <p>First case...</p>

        @break
    @case(2)
        <p>Second case...</p>

        @break 
    @default
        <p>Default case...</p>
@endswitch`
        );
    });

    test('formatting switch as an html attribute', function () {
        const input = `
<div
    @switch(true)
        @case($condition)
            title="thing"
            @break
    @endswitch
></div>
`;
        const out = `<div 
    @switch(true)
        @case($condition)
            title="thing"
            @break
    @endswitch
></div>
`;
        const format1 = formatBladeString(input),
            format2 = formatBladeString(format1);
        assert.strictEqual(format1, out);
        assert.strictEqual(format2, out);
    });
});