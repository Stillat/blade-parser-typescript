import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';
import { BladeDocument } from '../document/bladeDocument';
import { DirectiveNode } from '../nodes/nodes';

suite('Unknown Directives Test', () => {
    test('unknown directive compiler', () => {
        const compiler = new PhpCompiler();
        compiler.setUnknownDirectiveCompiler({
            compile(node) {
                const directive = node as DirectiveNode;
                return `Unknown directive: ${directive.name}`;
            },
        });

        assert.strictEqual(
            compiler.compile(BladeDocument.fromText('@unknownOne @unknownTwo')),
            'Unknown directive: unknownOne Unknown directive: unknownTwo'
        );
    });
});