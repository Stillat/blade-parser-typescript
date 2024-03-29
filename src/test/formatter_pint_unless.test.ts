import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Unless Conditions', () => {
    test('pint: it can format unless statements', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@unless($true)

            @endunless
            
            
            @unless($true) 
                Hello @endunless
            
            @unless($true)
                                    <p>World
                                    
                                    </p>
            
            
            
            
            
                                    
            @endunless
            `)).trim(),
            `@unless ($true)
    
@endunless

@unless ($true)
    Hello
@endunless

@unless ($true)
    <p>World</p>
@endunless`
        );
    });

    test('pint: it can format nested unless', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`
            @unless($something)
            @unless($somethingTwo)
            @unless($somethingThree)
            @unless($somethingFour)
            <div>
                <p>I am just some {{ $text }}</p>
            </div>
            @endunless
            @endunless
            @endunless
            @endunless`)).trim(),
            `@unless ($something)
    @unless ($somethingTwo)
        @unless ($somethingThree)
            @unless ($somethingFour)
                <div>
                    <p>I am just some {{ $text }}</p>
                </div>
            @endunless
        @endunless
    @endunless
@endunless`
        );
    });
});