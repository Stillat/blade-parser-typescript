import assert from 'assert';
import { formatBladeString, formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Component Tags', () => {
    test('it formats simple component tags', async () => {
        assert.strictEqual(
            (await formatBladeString(`        <x-icon 
            @class([$icon, 'pe-2'])
                        />`)).trim(),
            `<x-icon @class([$icon, "pe-2"]) />`
        );
    });

    test('it can format component tag pairs', async () => {
        assert.strictEqual(
            (await formatBladeString(`    <x-icon 
            @class([$icon, 'pe-2'])
                        >
<div>
<p>test</p>
</div>
                    </x-icon>`)).trim(),
            `<x-icon @class([$icon, "pe-2"])>
    <div>
        <p>test</p>
    </div>
</x-icon>`
        );
    });

    test('it can format slots with names', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x-slot:name

            param="value" />`)).trim(),
            `<x-slot:name param="value" />`
        );
    });

    test('it normalizes inline names', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x:slot:name

            param="value" />`)).trim(),
            `<x-slot:name param="value" />`
        );
    });

    test('it normalizes inline name pairs', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x:slot:name

            param="value">
   <p>Content</p>
            </x:slot:name>`)).trim(),
            `<x-slot:name param="value">
    <p>Content</p>
</x-slot>`
        );
    });

    test('it normalizes names', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x:slot:name />`)).trim(),
            `<x-slot:name />`
        );
    });

    test('it formats dot names', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x-inputs.button 
            class="something" />`)).trim(),
            `<x-inputs.button class="something" />`
        );
    });

    test('it formats params and bindings', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x-alert            type="error"


 :message="$message" />`)).trim(),
            `<x-alert type="error" :message="$message" />`
        );
    });

    test('it formats escaped parameter bindings', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x-button                   

            
            ::class="{ danger: isDeleting }">
                           Submit
                       </x-button>`)).trim(),
            `<x-button ::class="{ danger: isDeleting }">Submit</x-button>`
        );
    });

    test('it formats json bindings', async () => {
        assert.strictEqual(
            (await formatBladeString(`<button :class="{ danger: isDeleting }">
            Submit
        </button>`)).trim(),
            `<button :class="{ danger: isDeleting }">Submit</button>`
        );
    });

    test('it formats inline echos', async () => {
        assert.strictEqual(
            (await formatBladeString(`<option 
                        {{ $isSelected($value) ? 'selected="selected"' : '' }} value="{{ $value }}">
                  {{ $label }}
        </option>`)).trim(),
            `<option
    {{ $isSelected($value) ? 'selected="selected"' : "" }}
    value="{{ $value }}"
>
    {{ $label }}
</option>`
        );
    });

    test('it formats attributes', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div {{ $attributes }}>
        <!-- Component content -->
    </div>`)).trim(),
        `<div {{ $attributes }}>
    <!-- Component content -->
</div>`
        );
    });

    test('it formats merged attributes', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}
        >
                    {{ $message }}
            </div>`)).trim(),
        `<div
    {{ $attributes->merge(["class" => "alert alert-" . $type]) }}
>
    {{ $message }}
</div>`
        );
    });

    test('it formats conditionally merged attributes', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
            {{ $message }}
        </div>`)).trim(),
            `<div {{ $attributes->class(["p-4", "bg-red" => $hasError]) }}>
    {{ $message }}
</div>`
        );
    });

    test('it formats chained merged attributes', async () => {
        assert.strictEqual(
            (await formatBladeString(`<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
            {{ $slot }}
        </button>`)).trim(),
            `<button {{ $attributes->class(["p-4"])->merge(["type" => "button"]) }}>
    {{ $slot }}
</button>`
        );
    });

    test('it preserves inline attributes params echos and directives', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x-alert attribute param="{{ $title }}" {{ $title }} @directiveName @directiveWithParams('test') />`)).trim(),
            `<x-alert
    attribute
    param="{{ $title }}"
    {{ $title }}
    @directiveName
    @directiveWithParams("test")
/>`
        );
    });

    test('it can format PHP inside directive parameters', async () => {
        assert.strictEqual(
            (await formatBladeString(`
            <x-alert @param($value    + $anotherValue) />`)).trim(),
            `<x-alert @param($value + $anotherValue) />`
        );
    });

    test('it preservies invalid PHP inside directive parameters', async () => {
        assert.strictEqual(
            (await formatBladeString(`
            <x-alert @param($value   $= + $anotherValue) />`)).trim(),
            `<x-alert @param($value   $= + $anotherValue) />`
        );
    });

    test('it can rewrite slots to not break HTML tag pairs', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x-alert>
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

    test('it can format attribute short syntax', async () => {
        const template = `<x-profile :$userId :$size></x-profile>`;
        const result = await formatBladeString(template);

        assert.strictEqual(result.trim(), template);
    });

    test('it preserves inline echo', async () => {
        const input = `<x-filament::avatar
        :src="filament()->getTenantAvatarUrl($tenant)"
        {{ $attributes }}
        />`;
        const out = `<x-filament::avatar
    :src="filament()->getTenantAvatarUrl($tenant)"
    {{ $attributes }}
/>
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it preserves comments', async () => {
        const input = `<x-foo {{-- foo="" --}} />`;
        const out = `<x-foo {{-- foo="" --}} />
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it does not break @click.prevent directive', async () => {
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
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it can format inline slot names', async () => {
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
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('custom html tags that have the same name as void tags can be formatted', async () => {
        const input = `
<object data="audi.wav">
  <param name="autoplay" value="true">
</object>
<Param something="here">
    <Param />
    <param name="autoplay" value="true">
</Param>
<audio controls>
  <source src="1.ogg" type="audio/ogg">
  <source src="2.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
  
  <track src="1.vtt" kind="subtitles" srclang="en" label="1">
  <track src="2.vtt" kind="subtitles" srclang="no" label="2">
</audio>
<p>Test<wbr>content</p>
<Wbr />
<Wbr>

</Wbr>
<Track>
    The track.
    <Track />
</Track>

<Source src="something.wav" />
<Source>
<object data="audi.wav">
  <param name="autoplay" value="true">
</object>
<Param something="here">
    <Param />
    <param name="autoplay" value="true">
</Param>
<audio controls>
  <source src="1.ogg" type="audio/ogg">
  <source src="2.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
</Source>
<hr>
<hr />
<Hr repeat="2" />
<Hr>
    Hello!
</Hr>
<img src="" />
<img src="">
<Img type="something">
Hello, there!
</Img>
<input type="text">
<input type="text"/>
<Input type="text" />
<Input type="text">
    Placeholder text.
</Input>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<Meta>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <Description>Hello!</Description>
</Meta>
<command type="checklist" label="Check List">Check List</command>
<Command something="here">
<map name="workmap">
  <area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm">
  <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm">
  <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="coffee.htm">
</map>
<embed type="image/jpg" src="pic.jpg" width="300" height="200">
<Area width="100" height="100" />
<Embed src="something.svg">

<command type="checklist" label="Check List">Check List</command>
<Command something="here">
<map name="workmap">
  <area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm">
  <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm">
  <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="coffee.htm">
</map>
<embed type="image/jpg" src="pic.jpg" width="300" height="200">
<Area width="100" height="100" />
<base href="https://www.w3schools.com/" target="_blank">
<Area width="100" height="100"/>
<Area width="100" height="100">
    Something.
</Area>
</Command>
</Embed>

<map name="workmap">
  <area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm">
  <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm">
  <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="coffee.htm">
</map>

<Area width="100" height="100" />

<base href="https://www.w3schools.com/" target="_blank">
<Area width="100" height="100"/>
<Area width="100" height="100">
    Something.
</Area>

<br>
<br />
<table>
  <colgroup>
    <col span="2" style="background-color:red">
    <col style="background-color:yellow">
  </colgroup>
</table>

<Col span="12">
    <Row>

    </Row>
</Col>

<Br repeat="2" />

<Br repeat="3">
<base href="https://www.w3schools.com/" target="_blank">
<Area width="100" height="100"/>
<Area width="100" height="100">
    Something.
</Area>
</Br>

<Base width="100" height="100">
    Something.
</Base>

@if ($something)
<link rel="">
<Link href="{{ route('profile.show') }}" class="text-sm text-gray-600 underline hover:text-gray-900">
    {{ __('Edit Profile') }}
    <Base width="100" height="100">
    Something.
    <map name="workmap">
  <area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm">
  <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm">
  <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="coffee.htm">
</map>

<Area width="100" height="100" />

<base href="https://www.w3schools.com/" target="_blank">
<Area width="100" height="100">
    Something.
</Area>
</Base>
</Link>

@endif

<base href="https://www.w3schools.com/" target="_blank">
<link rel="">
<Link href="{{ route('profile.show') }}" class="text-sm text-gray-600 underline hover:text-gray-900">
    {{ __('Edit Profile') }}
</Link>


`;
        const expected = `<object data="audi.wav">
    <param name="autoplay" value="true" />
</object>
<Param something="here">
    <Param />
    <param name="autoplay" value="true" />
</Param>
<audio controls>
    <source src="1.ogg" type="audio/ogg" />
    <source src="2.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.

    <track src="1.vtt" kind="subtitles" srclang="en" label="1" />
    <track src="2.vtt" kind="subtitles" srclang="no" label="2" />
</audio>
<p>
    Test
    <wbr />
    content
</p>
<Wbr />
<Wbr></Wbr>
<Track>
    The track.
    <Track />
</Track>

<Source src="something.wav" />
<Source>
    <object data="audi.wav">
        <param name="autoplay" value="true" />
    </object>
    <Param something="here">
        <Param />
        <param name="autoplay" value="true" />
    </Param>
    <audio controls>
        <source src="1.ogg" type="audio/ogg" />
        <source src="2.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
    </audio>
</Source>
<hr />
<hr />
<Hr repeat="2" />
<Hr>Hello!</Hr>
<img src="" />
<img src="" />
<Img type="something">
    Hello, there!
</Img>
<input type="text" />
<input type="text" />
<Input type="text" />
<Input type="text">
    Placeholder text.
</Input>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<Meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <Description>Hello!</Description>
</Meta>
<command type="checklist" label="Check List">Check List</command>
<Command something="here">
    <map name="workmap">
        <area
            shape="rect"
            coords="34,44,270,350"
            alt="Computer"
            href="computer.htm"
        />
        <area
            shape="rect"
            coords="290,172,333,250"
            alt="Phone"
            href="phone.htm"
        />
        <area
            shape="circle"
            coords="337,300,44"
            alt="Cup of coffee"
            href="coffee.htm"
        />
    </map>
    <embed type="image/jpg" src="pic.jpg" width="300" height="200" />
    <Area width="100" height="100" />
    <Embed src="something.svg">
        <command type="checklist" label="Check List">Check List</command>
        <Command something="here">
            <map name="workmap">
                <area
                    shape="rect"
                    coords="34,44,270,350"
                    alt="Computer"
                    href="computer.htm"
                />
                <area
                    shape="rect"
                    coords="290,172,333,250"
                    alt="Phone"
                    href="phone.htm"
                />
                <area
                    shape="circle"
                    coords="337,300,44"
                    alt="Cup of coffee"
                    href="coffee.htm"
                />
            </map>
            <embed type="image/jpg" src="pic.jpg" width="300" height="200" />
            <Area width="100" height="100" />
            <base href="https://www.w3schools.com/" target="_blank" />
            <Area width="100" height="100" />
            <Area width="100" height="100">
                Something.
            </Area>
        </Command>
    </Embed>

    <map name="workmap">
        <area
            shape="rect"
            coords="34,44,270,350"
            alt="Computer"
            href="computer.htm"
        />
        <area
            shape="rect"
            coords="290,172,333,250"
            alt="Phone"
            href="phone.htm"
        />
        <area
            shape="circle"
            coords="337,300,44"
            alt="Cup of coffee"
            href="coffee.htm"
        />
    </map>

    <Area width="100" height="100" />

    <base href="https://www.w3schools.com/" target="_blank" />
    <Area width="100" height="100" />
    <Area width="100" height="100">
        Something.
    </Area>

    <br />
    <br />
    <table>
        <colgroup>
            <col span="2" style="background-color: red" />
            <col style="background-color: yellow" />
        </colgroup>
    </table>

    <Col span="12">
        <Row></Row>
    </Col>

    <Br repeat="2" />

    <Br repeat="3">
        <base href="https://www.w3schools.com/" target="_blank" />
        <Area width="100" height="100" />
        <Area width="100" height="100">
            Something.
        </Area>
    </Br>

    <Base width="100" height="100">
        Something.
    </Base>

    @if ($something)
        <link rel="" />
        <Link
            href="{{ route("profile.show") }}"
            class="text-sm text-gray-600 underline hover:text-gray-900"
        >
            {{ __("Edit Profile") }}
            <Base width="100" height="100">
                Something.
                <map name="workmap">
                    <area
                        shape="rect"
                        coords="34,44,270,350"
                        alt="Computer"
                        href="computer.htm"
                    />
                    <area
                        shape="rect"
                        coords="290,172,333,250"
                        alt="Phone"
                        href="phone.htm"
                    />
                    <area
                        shape="circle"
                        coords="337,300,44"
                        alt="Cup of coffee"
                        href="coffee.htm"
                    />
                </map>

                <Area width="100" height="100" />

                <base href="https://www.w3schools.com/" target="_blank" />
                <Area width="100" height="100">
                    Something.
                </Area>
            </Base>
        </Link>
    @endif

    <base href="https://www.w3schools.com/" target="_blank" />
    <link rel="" />
    <Link
        href="{{ route("profile.show") }}"
        class="text-sm text-gray-600 underline hover:text-gray-900"
    >
        {{ __("Edit Profile") }}
    </Link>
</Command>
`;
        assert.strictEqual(await formatBladeString(input), expected);
    });

    test('formatting comments inside attributs', async () => {
        const input = `

@if ($true)
<x-filament::button
    {{-- Test --}}
>
    Text
</x-filament::button>
@endif

`;
        const out = `@if ($true)
    <x-filament::button {{-- Test --}}>Text</x-filament::button>
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('it produces sane indentation on component tag expression parameters', async function () {
        const input = `<x-checkbox
    :checked="
        $firstCondition
        || $secondCondition
        || $thirdCondition
        || $fourthCondition
        || $fifthCondition
        || $sixthCondition
        || $seventhCondition
    "
/>`;
        const out = `<x-checkbox
    :checked="
        $firstCondition
        || $secondCondition
        || $thirdCondition
        || $fourthCondition
        || $fifthCondition
        || $sixthCondition
        || $seventhCondition
    "
/>
`;
        const format1 = await formatBladeString(input),
            format2 = await formatBladeString(format1);
        assert.strictEqual(format1, out)
        assert.strictEqual(format2, out)
    });

    test('it produces sane indentation on component tag expression parameters inside html elements', async function () {
        const input = `
<div>
<x-checkbox
    :checked="
        $firstCondition
        || $secondCondition
        || $thirdCondition
        || $fourthCondition
        || $fifthCondition
        || $sixthCondition
        || $seventhCondition
    "
/>
</div>
`;
        const out = `<div>
    <x-checkbox
        :checked="
            $firstCondition
            || $secondCondition
            || $thirdCondition
            || $fourthCondition
            || $fifthCondition
            || $sixthCondition
            || $seventhCondition
        "
    />
</div>
`;
        const format1 = await formatBladeString(input),
            format2 = await formatBladeString(format1);
        assert.strictEqual(format1, out)
        assert.strictEqual(format2, out)
    });

    test('it does not continue to indent attribute content', async() => {
        const input = `<div>
<div>
<div>
<x-component :prop="array_filter(array_merge([
[], []
]))" />
</div>
</div>
</div>`;
        const expected = `<div>
    <div>
        <div>
            <x-component :prop="array_filter(array_merge([
                [], []
            ]))" />
        </div>
    </div>
</div>
`;
        // Subsequent formats will now trigger line length wrapping/etc.
        const expected2 = `<div>
    <div>
        <div>
            <x-component
                :prop="array_filter(array_merge([
                    [], []
                ]))"
            />
        </div>
    </div>
</div>
`;
        let out = await formatBladeString(input);
        assert.strictEqual(out, expected);

        for (let i = 0; i < 5; i++) {
            out = await formatBladeString(out);
            assert.strictEqual(out, expected2);
        }
    });

    test('it does not lose leading escape character in directive-like parameters', async () => {
        const input = `

<x-hero @@click="navigaotr" one="two">
<p>Hello, world.</p></x-hero>
`;
        const out = `<x-hero @@click="navigaotr" one="two">
    <p>Hello, world.</p>
</x-hero>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });
});