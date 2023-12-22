import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Ignoring Templates', () => {
    test('pint: it can ignore things', async () => {
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

<x-slot:name param="value">
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
        assert.strictEqual(await formatBladeStringWithPint(template), output);
        assert.strictEqual(await formatBladeStringWithPint(output), output);
    }).timeout(5000);

    test('pint: it restores ignored parts inside child documents', async () => {
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
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('including escaped nodes does not trash document', async () => {
        const input = `<div>
    <h1>@{{ user.name }}</h1>

    <div>
        @include("project.settings.basic")
        @include("project.settings.source")
        @if (Auth::id() === $project->user_id)
            @include('project.settings.transfer')
        @endif
        @if (Auth::id() === $project->user_id)
            @include('project.settings.delete')
        @endif
    </div>
</div>`;
        const expected = `<div>
    <h1>@{{ user.name }}</h1>

    <div>
        @include('project.settings.basic')
        @include('project.settings.source')
        @if (Auth::id() === $project->user_id)
            @include('project.settings.transfer')
        @endif

        @if (Auth::id() === $project->user_id)
            @include('project.settings.delete')
        @endif
    </div>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), expected);
    });

    test('including escaped nodes can still indent blade', async () => {
        const input = `<div>
    <h1>@{{ user.name }}</h1>

<div>
@include("project.settings.basic")
@include("project.settings.source")
@if (Auth::id() === $project->user_id)
@include('project.settings.transfer')
@endif
@if (Auth::id() === $project->user_id)
@include('project.settings.delete')
@endif
</div>
</div>`;
        const out = `<div>
    <h1>@{{ user.name }}</h1>

    <div>
        @include('project.settings.basic')
        @include('project.settings.source')
        @if (Auth::id() === $project->user_id)
            @include('project.settings.transfer')
        @endif

        @if (Auth::id() === $project->user_id)
            @include('project.settings.delete')
        @endif
    </div>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('it can unwrap conditions when escaped nodes are present', async () => {
        const input = `<div>
<h1>@{{ user.name }}</h1>

<div>@if($user->avatar) @include('users.avatar')@endif</div>
</div>`;
        const out = `<div>
    <h1>@{{ user.name }}</h1>

    <div>
        @if ($user->avatar)
            @include('users.avatar')
        @endif
    </div>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('it can unwrap conditions when escaped nodes are present - trippple echo', async () => {
        const input = `<div>
<h1>@{{{ user.name }}}</h1>

<div>@if($user->avatar) @include('users.avatar')@endif</div>
</div>`;
        const out = `<div>
    <h1>@{{{ user.name }}}</h1>

    <div>
        @if ($user->avatar)
            @include('users.avatar')
        @endif
    </div>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('it can unwrap conditions when escaped nodes are present - escaped directive', async () => {
        const input = `<div>
<h1>@@somethingHere</h1>

<div>@if($user->avatar) @include('users.avatar')@endif</div>
</div>`;
        const out = `<div>
    <h1>@@somethingHere</h1>

    <div>
        @if ($user->avatar)
            @include('users.avatar')
        @endif
    </div>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('it can unwrap conditions when escaped nodes are present - raw echo', async () => {
        const input = `<div>
<h1>@{!! user.name !!}</h1>

<div>@if($user->avatar) @include('users.avatar')@endif</div>
</div>`;
        const out = `<div>
    <h1>@{!! user.name !!}</h1>

    <div>
        @if ($user->avatar)
            @include('users.avatar')
        @endif
    </div>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('ignore doesnt eat nested nodes', async () => {
const input = `
@php
$isHidden = $formComponent->isHidden();
$isHidden = $formComponent->isHidden();
@endphp

{{-- format-ignore-start --}}
<x-filament::grid
    :x-data="$isRoot ? '{}' : null"
>
    @foreach ($getComponents(withHidden: true) as $formComponent)
    Test
        @php
            $isHidden = $formComponent->isHidden();
            $isHidden = $formComponent->isHidden();
        @endphp

        <x-filament::grid.column
        >
            @if (! $isHidden)
                {{ $formComponent }}
            @endif
        </x-filament::grid.column>

{{ verbatim }}
@php
$isHidden = $formComponent->isHidden();
$isHidden = $formComponent->isHidden();
@endphp

<x-filament::grid.column
>
@if (! $isHidden)
    {{ $formComponent }}
@endif
</x-filament::grid.column>
{{ endverbatim }}
    @endforeach
</x-filament::grid>
{{-- format-ignore-end --}}
`;
        const out = `@php
    $isHidden = $formComponent->isHidden();
    $isHidden = $formComponent->isHidden();
@endphp

{{-- format-ignore-start --}}
<x-filament::grid
    :x-data="$isRoot ? '{}' : null"
>
    @foreach ($getComponents(withHidden: true) as $formComponent)
    Test
        @php
            $isHidden = $formComponent->isHidden();
            $isHidden = $formComponent->isHidden();
        @endphp

        <x-filament::grid.column
        >
            @if (! $isHidden)
                {{ $formComponent }}
            @endif
        </x-filament::grid.column>

{{ verbatim }}
@php
$isHidden = $formComponent->isHidden();
$isHidden = $formComponent->isHidden();
@endphp

<x-filament::grid.column
>
@if (! $isHidden)
    {{ $formComponent }}
@endif
</x-filament::grid.column>
{{ endverbatim }}
    @endforeach
</x-filament::grid>
{{-- format-ignore-end --}}
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });
});