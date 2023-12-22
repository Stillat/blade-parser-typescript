import assert from 'assert';
import { ArrayPrinter } from '../document/printers/arrayPrinter.js';
import { ArrayNode } from '../nodes/nodes.js';
import { SimpleArrayParser } from '../parser/simpleArrayParser.js';
import { assertNotNull } from './testUtils/assertions.js';

suite('Simple Array Parser', () => {
    test('it can parse and print arrays', () => {
        const parser = new SimpleArrayParser(),
            array = parser.parse(`['hello', 'world', 'this' => 'that',

            'nested' => ['array', 'here', 'nested' => ['array', 'here']], 'test', [0,1,2], 'test', $variable,
            'test' => \\Something\\Test\\Here::class,
        ]`);
        assertNotNull(array);

        const printed = ArrayPrinter.print(array as ArrayNode, 4, 1);

        assert.strictEqual(
            printed,
            `[
    'hello',
    'world',
    'this' => 'that',
    'nested' => [
        'array',
        'here',
        'nested' => [
            'array',
            'here',
        ],
    ],
    'test',
    'test',
    $variable,
    'test' => \\Something\\Test\\Here::class,
]`
        );
    });
});