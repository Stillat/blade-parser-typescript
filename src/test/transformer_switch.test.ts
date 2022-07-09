import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Switch Transformer', () => {
    test('it can transform switch statements', () => {
        assert.strictEqual(
            transformString(`@switch($i)
{{-- Leading node test. --}}

<p>
Test
{{ $title }}
</p>
@case(1)
First case...

@break
@case(2)
Second case...

@break
@default
Default case...
@endswitch

@switch($i)
{{-- Leading node test. --}}

<p>
Test
{{ $title }}
</p>
@case(1)
First case...

@break
@case(2)
Second case...

@endswitch

@switch($i)
<div>
<p>Just testing
</p>
</div>
@endswitch

@switch($i)
@default
<div>
<p>Just testing
</p>
</div>
@endswitch

@switch($i)
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

<p>
Test
{{ $title }}
</p>
@case(1)
First case...



@break@case(2)
Second case...



@break@default
Default case...
@endswitch


@switch($i)


{{-- Leading node test. --}}

<p>
Test
{{ $title }}
</p>
@case(1)
First case...



@break@case(2)
Second case...
@endswitch

@switch($i)

<div>
<p>Just testing
</p>
</div>
@endswitch



@switch($i)
@default
<div>
<p>Just testing
</p>
</div>
@endswitch


@switch($i)


{{-- Leading node test. --}}

<p>Test {{ $title }} 
</p>
@case(1) <p>First case...</p> 

@break@case(2) <p>Second case...</p>


@break @default


<p>Default case...</p>
@endswitch`
        );
    });
});