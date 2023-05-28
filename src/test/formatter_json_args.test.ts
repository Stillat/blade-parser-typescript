import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Directive JSON Arguments', () => {
    test('it applies relative indentation to JSON argument blocks', () => {
        const input = `
@someDirectiveName({
    "name": "John Doe",
                    "age": 33,
    
    
    
    "address": "Anytown, USA",
        "skills": [
            "one",
                    "two", "three"
        ]
    })

<div>@someDirectiveName({
    "name": "John Doe",
                    "age": 33,
    
    
    
    "address": "Anytown, USA",
        "skills": [
            "one",
                    "two", "three"
        ]
    })
</div>

<div><div>
@someDirectiveName({
    "name": "John Doe",
                    "age": 33,
    
    
    
    "address": "Anytown, USA",
        "skills": [
            "one",
                    "two", "three"
        ]
    })
</div></div>
`;
        const expected = `@someDirectiveName({
  "name": "John Doe",
  "age": 33,
  "address": "Anytown, USA",
  "skills": [
    "one",
    "two",
    "three"
  ]
})

<div>
    @someDirectiveName({
      "name": "John Doe",
      "age": 33,
      "address": "Anytown, USA",
      "skills": [
        "one",
        "two",
        "three"
      ]
    })
</div>

<div>
    <div>
        @someDirectiveName({
          "name": "John Doe",
          "age": 33,
          "address": "Anytown, USA",
          "skills": [
            "one",
            "two",
            "three"
          ]
        })
    </div>
</div>
`;
        assert.strictEqual(formatBladeString(input), expected);
    });
});