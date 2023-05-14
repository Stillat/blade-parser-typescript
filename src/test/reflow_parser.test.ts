import assert from 'assert';
import { PhpOperatorReflow } from '../formatting/phpOperatorReflow';
import { LiteralNode, OperatorNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf } from './testUtils/assertions';

suite('PHP Operator Reflow Parser', () => {
    test('it breaks strings apart', () => {
        const template = ` !$foo /** !!! */ ** true //! `,
            parser = new PhpOperatorReflow();
        parser.parse(template);

        const tokens = parser.getTokens();
        
        assertCount(3, tokens);
        assertInstanceOf(LiteralNode, tokens[0]);
        assertInstanceOf(OperatorNode, tokens[1]);
        assertInstanceOf(LiteralNode, tokens[2]);

        const operator = tokens[1] as OperatorNode,
            startLiteral = tokens[0] as LiteralNode,
            endLiteral = tokens[2] as LiteralNode;

        assert.strictEqual(operator.sourceContent, '!');
        assert.strictEqual(endLiteral.content, '$foo /** !!! */ ** true //! ');
        assert.strictEqual(startLiteral.content, ' ');
    });

    test('it reflows operators', () => {
        const parser = new PhpOperatorReflow();

        assert.strictEqual(
            parser.reflow(' !$foo /** !!! */ && true //! '),
            ' ! $foo /** !!! */ && true //! '
        );

        assert.strictEqual(
            parser.reflow(' !$foo'),
            ' ! $foo'
        );

        assert.strictEqual(
            parser.reflow(' !$foo && (! $that)'),
            ' ! $foo && (! $that)'
        );
    });
});