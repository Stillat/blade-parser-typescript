import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Switch Statements', () => {
    test('pint: it can format simple switch statements', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can format leading switch nodes', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can format switch with embedded HTML', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can format switch without breaks', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can format switch without default', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can format switch with no cases', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can format switch with just default', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can wrap to next line', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`@switch($i)
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
});