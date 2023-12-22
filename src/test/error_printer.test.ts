import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { ErrorPrinter } from '../document/printers/errorPrinter.js';

suite('Error Printer Test', () => {
    test('it can pretty print error messages', () => {
        const doc = BladeDocument.fromText(`asdf
asdfasdf
asdfasdffasdf

asdfasdffasdf
asdfasdf
asdf

@if ($something)
    asdfasdf
    asdf`),
            firstError = doc.errors.getFirstStructureError(),
            lines = doc.getLinesAround((firstError.node?.startPosition?.line) ?? 1),
            printed = ErrorPrinter.printError(firstError, lines);

        assert.strictEqual(
            printed.trim(),
            `Unpaired condition control structure

  06| asdfasdf
  07| asdf
  08| 
 >09| @if ($something)
  10|     asdfasdf
  11|     asdf`
        );
    });
});