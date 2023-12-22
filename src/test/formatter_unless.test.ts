import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Unless Statements', () => {
    test('it can format unless statements', async () => {
        assert.strictEqual(
            (await formatBladeString(`@unless($true)

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

    test('it can format nested unless', async () => {
        assert.strictEqual(
            (await formatBladeString(`
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