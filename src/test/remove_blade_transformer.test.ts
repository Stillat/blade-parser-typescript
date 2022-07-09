import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument';


suite('Transformer Remove Blade', () => {
    test('it can remove blade', () => {
        const result = BladeDocument.fromText(`<html>
    <head>
        <title>Transformer Test</title>
    </head>
    <body>
    before
    @if (count($records) === 1)
        I have one record!
    @elseif (count($records) > 1)
        I have multiple records!
    @else
        I don't have any records!
    @endif after
    </body>
</html>
`).transform().removeBlade();
        assert.strictEqual(result, "<html>\n    <head>\n        <title>Transformer Test</title>\n    </head>\n    <body>\n    before\n    \n        I have one record!\n    \n        I have multiple records!\n    \n        I don't have any records!\n    after\n    </body>\n</html>\n");
    });
});