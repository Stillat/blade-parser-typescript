import assert from 'assert';
import { LiteralNode, OperatorNode } from '../nodes/nodes.js';
import { assertCount, assertInstanceOf } from './testUtils/assertions.js';
import { GeneralSyntaxReflow } from '../formatting/generalSyntaxReflow.js';

suite('PHP Operator Reflow Parser', () => {
    test('it breaks strings apart', () => {
        const template = ` !$foo /** !!! */ ** true //! `,
            parser = new GeneralSyntaxReflow();
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
        const parser = new GeneralSyntaxReflow();

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