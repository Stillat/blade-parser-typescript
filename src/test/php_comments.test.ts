import assert = require('assert');
import { BladeDocument } from '../document/bladeDocument';
import { DirectiveNode, LiteralNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf, assertLiteralContent } from './testUtils/assertions';

suite('PHP Comments', () => {
    test('it can handle line comments', () => {
        const nodes = BladeDocument.fromText(`@isset(
        $records // @isset())2
        )
// $records is defined and is not null...
@endisset`).getAllNodes();
        assertCount(3, nodes);

        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);

        assertLiteralContent("\n// $records is defined and is not null...\n", nodes[1]);

        const directiveOne = nodes[0] as DirectiveNode,
            directiveTwo = nodes[2] as DirectiveNode;

        assert.strictEqual(directiveOne.directiveName, 'isset');
        assert.strictEqual(directiveOne.directiveParameters, "(\n        $records // @isset())2\n        )");
        assert.strictEqual(directiveOne.sourceContent, "@isset(\n        $records // @isset())2\n        )");
        assert.strictEqual(directiveOne.hasDirectiveParameters, true);

        assert.strictEqual(directiveTwo.directiveName, 'endisset');
        assert.strictEqual(directiveTwo.directiveParameters, '');
        assert.strictEqual(directiveTwo.sourceContent, '@endisset');
        assert.strictEqual(directiveTwo.hasDirectiveParameters, false);
    });


    test('it can handle multi-line comments', () => {
        const nodes = BladeDocument.fromText(`@isset(
        $records /* @isset())2
        @isset(
            $records /* @isset())2
            )
    // $records is defined and is not null...
    @endisset
    */
        a)b
// $records is defined and is not null...
@endisset`).getAllNodes();
        assertCount(3, nodes);

        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);

        assertLiteralContent("b\n// $records is defined and is not null...\n", nodes[1]);

        const directiveOne = nodes[0] as DirectiveNode,
            directiveTwo = nodes[2] as DirectiveNode;

        assert.strictEqual(directiveOne.directiveName, 'isset');
        assert.strictEqual(directiveOne.directiveParameters, "(\n        $records /* @isset())2\n        @isset(\n            $records /* @isset())2\n            )\n    // $records is defined and is not null...\n    @endisset\n    */\n        a)");
        assert.strictEqual(directiveOne.sourceContent, "@isset(\n        $records /* @isset())2\n        @isset(\n            $records /* @isset())2\n            )\n    // $records is defined and is not null...\n    @endisset\n    */\n        a)");
        assert.strictEqual(directiveOne.hasDirectiveParameters, true);

        assert.strictEqual(directiveTwo.directiveName, 'endisset');
        assert.strictEqual(directiveTwo.directiveParameters, '');
        assert.strictEqual(directiveTwo.sourceContent, '@endisset');
        assert.strictEqual(directiveTwo.hasDirectiveParameters, false);
    });
});