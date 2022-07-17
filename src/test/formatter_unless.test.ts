import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Unless Statements', () => {
    test('it can format unless statements', () => {
        assert.strictEqual(
            formatBladeString(`@unless($true)

            @endunless
            
            
            @unless($true) 
                Hello @endunless
            
            @unless($true)
                                    <p>World
                                    
                                    </p>
            
            
            
            
            
                                    
            @endunless
            `).trim(),
            `@unless($true)
    
@endunless

@unless($true)
    Hello
@endunless

@unless($true)
    <p>World</p>
@endunless`
        );
    });

    test('it can format nested unless', () => {
        assert.strictEqual(
            formatBladeString(`
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
            @endunless`).trim(),
            `@unless($something)
    @unless($somethingTwo)
        @unless($somethingThree)
            @unless($somethingFour)
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