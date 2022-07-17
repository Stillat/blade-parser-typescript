import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('<script> tag containing structures test', () => {
    test('it can apply relative indent levels on <script> tags', () => {
        assert.strictEqual(
            formatBladeString(`<html>
            @directive($test)
            
                    @enddirective
            
                <style>
                                            
                                .thing {
                                    background-color: @foreach ($something as $somethingElse)
                                        {{ $thing}}
                                    @endforeach
                                }
                
                                </style>
            
                <style></style>
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
            
                    <script>
            
            var app = '@if ($something) something @else something-else @endif'.trim();
            
            if (something) {
              // Do something.
            } else {
              // Do something else.
            }
                    
                    </script>
            
                    <script></script>
                </body>
            </html>`).trim(),
            `<html>
    @directive($test)
        
    @enddirective

    <style>
        .thing {
            background-color: @foreach ($something as $somethingElse)
                {{ $thing}}
            @endforeach
        }
    </style>

    <style></style>
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

        <script>
            var app = '@if ($something) something @else something-else @endif'.trim();

            if (something) {
              // Do something.
            } else {
              // Do something else.
            }
        </script>

        <script></script>
    </body>
</html>`
        );
    });
});