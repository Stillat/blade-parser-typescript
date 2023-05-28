import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Formatting Error Recovery', () => {
    test('it can recover from invalid strings when parsing directive arguments', () => {
        const input = `
<div>

@someDirectiveName(array(
    
    "skills" => [
        "thr'
    ]
))
</div>
`;
        const expected = `<div>
    @someDirectiveName(array(
    
    "skills" => [
        "thr'
    ]
))
</div>
`;
        assert.strictEqual(formatBladeString(input), expected);
    });

    test('it can recover from improperly closed directive arguments', () => {
        // The output isn't great, but it won't delete things at least.
        const input = `
<div><div>
@someDirectiveName(array(
    "name" => "John Doe",
        "age" => 33,
            "address" => "Anytown, USA",
                "skills" => [
                    "one",
                    "two",
                    "three",
                ]
)
</div></div>
`;
        const expected  = `<div>
    <div>
        @someDirectiveName
        (array( "name" => "John Doe", "age" => 33, "address" => "Anytown, USA",
        "skills" => [ "one", "two", "three", ] )
    </div>
</div>
`;
        assert.strictEqual(formatBladeString(input), expected);
    });
});