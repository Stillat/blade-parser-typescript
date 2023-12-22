import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Basic <style> and <script> Formatting', () => {
    test('it can format echo and directives inside style and script tags', async () => {
        assert.strictEqual(
            (await formatBladeString(`
            <html>
            <style>
                .thing {
                    background-color: 
                    {{
                                     $color            }}
                                                        }
                                                    </style>
                                                    {{ $color }}
            <style>
                .thing {
                    background-color: {{ $color   + $something +                 $otherThing 
                    
                    
                    
                                    }}
                }
            </style>
            <body>
            
                                <script>
                                var test = @js(         'something'             )
                                </script>
                    @js('something')
                                            <script>
                                            var test = @js(   'something'      )
                                            </script>
                                            </body>
            
                                            </html>`)).trim(),
            `<html>
    <style>
        .thing {
            background-color: {{ $color }};
        }
    </style>
    {{ $color }}
    <style>
        .thing {
            background-color: {{ $color + $something + $otherThing }};
        }
    </style>
    <body>
        <script>
            var test = @js("something");
        </script>
        @js("something")
        <script>
            var test = @js("something");
        </script>
    </body>
</html>`
        );
    });

    test('it does not continue to indent', async () => {
        const input = `
<style>
    :root {
        --foo: red;

        @if (true)
            --bar: blue;
        @endif
    }
</style>
`;
        const expected = `<style>
    :root {
        --foo: red;

        @if (true)
            --bar: blue;
        @endif
    }
</style>
`;

        let out = await formatBladeString(input);
        assert.strictEqual(out, expected);

        for (let i = 0; i < 5; i++) {
            out = await formatBladeString(out);
            
            assert.strictEqual(out, expected);
        }
    });

    test('it does not do really dumb things if already indented nicely', async () => {
        const input = `
<style>
    :root {
        --foo: red;

        @if (true)
            --bar: blue;
        @endif
    }
</style>

<div>
    <style>
        :root {
            --foo: red;

            @if (true)
                --bar: blue;
            @endif
        }
    </style>
</div>
`;
        const out = `<style>
    :root {
        --foo: red;

        @if (true)
            --bar: blue;
        @endif
    }
</style>

<div>
    <style>
        :root {
            --foo: red;

            @if (true)
                --bar: blue;
            @endif
        }
    </style>
</div>
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });
});