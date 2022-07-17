import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('<style> Containing Structures', () => {
    test('it preserves relative indents when formatting style tags', () => {
        assert.strictEqual(
            formatBladeString(`<html><head>
            @directive($test)
            
                    @enddirective
            
                <style>
                                            
                                .thing {
                                    background-color: @foreach ($something as $somethingElse)
                                        {{ $thing}}
                                    @endforeach
                                }
                
                                </style>
                    </head>        </html>`).trim(),
            `<html>
    <head>
        @directive($test)
            
        @enddirective

        <style>
            .thing {
                background-color: @foreach ($something as $somethingElse)
                    {{ $thing}}
                @endforeach
            }
        </style>
    </head>
</html>`
        );
    });

    test('it can apply relative indent to styles inside structures', () => {
        assert.strictEqual(
            formatBladeString(`<html>

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
        </html>`).trim(),
            `<html>
    <body>
        @if($true)
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
</html>`
        );
    });
});