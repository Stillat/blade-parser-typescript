import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Ignoring Templates', () => {
    test('pint: it can ignore things', () => {
        const template = `
{{-- format-ignore-start --}}

<x:slot:name

            param="value">
   <p>Content</p>
            </x:slot:name>

<p>{{ $one }}: {{ $two }}</p>
<p>
{{ $one  }}:
{{ $two }}
</p>
{{-- 
                                                                            Just 
                                                a comment --}}
@if         ($true)
            <span>Hello</span>
            @elseif                     ($anotherValue)
            <div>
                <p>Hello world</p>
                <div>
                @pair
                    Test
                    @directive   ($test  + $that-$another   + $thing)
            @endpair
                </div>
                </div>
            @else
            
            <p>Test {{ $title}}     test
                    </p>
            
            @endif

            @switch($i)
            @case(1)
                First case...
                @break
            @case(2)
                Second case...
                @break
            @default



                Default case...
            @endswitch

            @unless($true)

            @endunless
            
            @directive   ($test  + $that-$another   + $thing)
            @unless($true) 
                Hello @endunless
            
            @unless($true)
                                    <p>World
                                    
                                    </p>
            
            
                                    <x-icon 
                                    @class([$icon, 'pe-2'])
                                                >
                        <div>
                        <p>test</p>
                        </div>
                                            </x-icon>
            
            
                                    
            @endunless

            <div>
            @forelse ($users as $user)
                <li>{{ $user->name }}</li>
                                                                    @endforelse
                                                                </div>
                                                                
                                                                @forelse ($users as $user)
                                                                    <li>{{ $user->name }}</li>
                                                                @endforelse
                                                                <?php

                                                                $kernel = $app->                make(Illuminate\\Contracts\\Console\\Kernel::class);
                                                                
                                                                $status =           $kernel->
                                                                
                                                                                        handle(
                                                                                                    $input = new Symfony\\Component\\Console\\Input\\ArgvInput,
                                                                                                    new Symfony\\Component\\Console\\Output\\ConsoleOutput
                                                                );
                                                                
                                                                ?>
{{-- format-ignore-end --}}

<x:slot:name

            param="value">
   <p>Content</p>
            </x:slot:name>

<p>{{ $one }}: {{ $two }}</p>
<p>
{{ $one  }}:
{{ $two }}
</p>
{{-- 
                                                                            Just 
                                                a comment --}}
@if         ($true)
            <span>Hello</span>
            @elseif                     ($anotherValue)
            <div>
                <p>Hello world</p>
                <div>
                @pair
                    Test
                    @directive   ($test  + $that-$another   + $thing)
            @endpair
                </div>
                </div>
            @else
            
            <p>Test {{ $title}}     test
                    </p>
            
            @endif

            @switch($i)
            @case(1)
                First case...
                @break
            @case(2)
                Second case...
                @break
            @default



                Default case...
            @endswitch

            @unless($true)

            @endunless
            
            @directive   ($test  + $that-$another   + $thing)
            @unless($true) 
                Hello @endunless
            
            @unless($true)
                                    <p>World
                                    
                                    </p>
            
            
                                    <x-icon 
                                    @class([$icon, 'pe-2'])
                                                >
                        <div>
                        <p>test</p>
                        </div>
                                            </x-icon>
            
            
                                    
            @endunless

            <div>
            @forelse ($users as $user)
                <li>{{ $user->name }}</li>
                                                                    @endforelse
                                                                </div>
                                                                
                                                                @forelse ($users as $user)
                                                                    <li>{{ $user->name }}</li>
                                                                @endforelse
<?php

$kernel = $app->                make(Illuminate\\Contracts\\Console\\Kernel::class);

$status = $kernel->handle($input = new Symfony\\Component\\Console\\Input\\ArgvInput, new Symfony\\Component\\Console\\Output\\ConsoleOutput);


?>
`;
        const output = `{{-- format-ignore-start --}}

<x:slot:name

            param="value">
   <p>Content</p>
            </x:slot:name>

<p>{{ $one }}: {{ $two }}</p>
<p>
{{ $one  }}:
{{ $two }}
</p>
{{-- 
                                                                            Just 
                                                a comment --}}
@if         ($true)
            <span>Hello</span>
            @elseif                     ($anotherValue)
            <div>
                <p>Hello world</p>
                <div>
                @pair
                    Test
                    @directive   ($test  + $that-$another   + $thing)
            @endpair
                </div>
                </div>
            @else
            
            <p>Test {{ $title}}     test
                    </p>
            
            @endif

            @switch($i)
            @case(1)
                First case...
                @break
            @case(2)
                Second case...
                @break
            @default



                Default case...
            @endswitch

            @unless($true)

            @endunless
            
            @directive   ($test  + $that-$another   + $thing)
            @unless($true) 
                Hello @endunless
            
            @unless($true)
                                    <p>World
                                    
                                    </p>
            
            
                                    <x-icon 
                                    @class([$icon, 'pe-2'])
                                                >
                        <div>
                        <p>test</p>
                        </div>
                                            </x-icon>
            
            
                                    
            @endunless

            <div>
            @forelse ($users as $user)
                <li>{{ $user->name }}</li>
                                                                    @endforelse
                                                                </div>
                                                                
                                                                @forelse ($users as $user)
                                                                    <li>{{ $user->name }}</li>
                                                                @endforelse
                                                                <?php

                                                                $kernel = $app->                make(Illuminate\\Contracts\\Console\\Kernel::class);
                                                                
                                                                $status =           $kernel->
                                                                
                                                                                        handle(
                                                                                                    $input = new Symfony\\Component\\Console\\Input\\ArgvInput,
                                                                                                    new Symfony\\Component\\Console\\Output\\ConsoleOutput
                                                                );
                                                                
                                                                ?>
{{-- format-ignore-end --}}

<x-slot name="name" param="value">
    <p>Content</p>
</x-slot>

<p>{{ $one }}: {{ $two }}</p>
<p>
    {{ $one }}:
    {{ $two }}
</p>
{{--
    Just
    a comment
--}}
@if ($true)
    <span>Hello</span>
@elseif ($anotherValue)
    <div>
        <p>Hello world</p>
        <div>
            @pair
                Test
                @directive($test + $that - $another + $thing)
            @endpair
        </div>
    </div>
@else
    <p>Test {{ $title }} test</p>
@endif

@switch($i)
    @case(1)
        First case...

        @break
    @case(2)
        Second case...

        @break
    @default
        Default case...
@endswitch

@unless ($true)
    
@endunless

@directive($test + $that - $another + $thing)
@unless ($true)
    Hello
@endunless

@unless ($true)
    <p>World</p>

    <x-icon @class([$icon, 'pe-2'])>
        <div>
            <p>test</p>
        </div>
    </x-icon>
@endunless

<div>
    @forelse ($users as $user)
        <li>{{ $user->name }}</li>
    @endforelse
</div>

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@endforelse

<?php

$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);

$status = $kernel->handle($input = new Symfony\\Component\\Console\\Input\\ArgvInput, new Symfony\\Component\\Console\\Output\\ConsoleOutput);

?>
`;
        assert.strictEqual(formatBladeStringWithPint(template), output);
        assert.strictEqual(formatBladeStringWithPint(output), output);
    }).timeout(5000);

    test('pint: it restores ignored parts inside child documents', () => {
        const input = `
@if (true)
    {{-- format-ignore-start --}}
    <div></div>
    {{-- format-ignore-end --}}
@endif
`;
        const out = `@if (true)
    {{-- format-ignore-start --}}
    <div></div>
    {{-- format-ignore-end --}}
@endif
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });
});