import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Styles and Scripts', () => {
    test('pint: it preserves relative indents when formatting style tags', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<html><head>
            @directive($test)
            
                    @enddirective
            
                <style>
                                            
                                .thing {
                                    background-color: @foreach ($something as $somethingElse)
                                        {{ $thing}}
                                    @endforeach
                                }
                
                                </style>
                    </head>        </html>`)).trim(),
            `<html>
    <head>
        @directive($test)
            
        @enddirective

        <style>
            .thing {
                background-color: @foreach ($something as $somethingElse)
                    {{ $thing }}
                @endforeach
            }
        </style>
    </head>
</html>`
        );
    });

    test('pint: it can apply relative indent to styles inside structures', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<html>

            <body>
        
        @if ($true)
            <style>
                        
        
        
        
        .thing {
            background-color: @foreach ($something as $somethingElse)
                {{ $thing}}
            @endforeach
        }
        
            </style>
        
        @endif
        
                <script></script>
            </body>
        </html>`)).trim(),
            `<html>
    <body>
        @if ($true)
            <style>
                .thing {
                    background-color: @foreach ($something as $somethingElse)
                        {{ $thing }}
                    @endforeach
                }
            </style>
        @endif

        <script></script>
    </body>
</html>`
        );
    });
});