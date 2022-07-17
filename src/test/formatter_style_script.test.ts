import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Basic <style> and <script> Formatting', () => {
    test('it can format echo and directives inside style and script tags', () => {
        assert.strictEqual(
            formatBladeString(`
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
            
                                            </html>`).trim(),
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
});