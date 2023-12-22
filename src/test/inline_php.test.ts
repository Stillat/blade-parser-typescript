import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { FragmentPosition, InlinePhpNode, LiteralNode, ShorthandInlinePhpNode } from '../nodes/nodes.js';
import { assertCount, assertInstanceOf, assertLiteralContent } from './testUtils/assertions.js';

suite('Inline PHP Parsing', () => {
    test('it parses inline PHP regions', () => {
        const nodes = BladeDocument.fromText(`


<html>
        <?php

$test = 'this';

?>
        hello <?php echo 'world<?php ?>'; ?>
</html>`).getAllNodes();
        assertCount(5, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("\n\n\n<html>\n        ", nodes[0]);
        assertInstanceOf(InlinePhpNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent("\n        hello ", nodes[2]);
        assertInstanceOf(InlinePhpNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("\n</html>", nodes[4]);

        const php1 = nodes[1] as InlinePhpNode,
            php2 = nodes[3] as InlinePhpNode;

        assert.strictEqual(php1.sourceContent, "<?php\n\n$test = 'this';\n\n?>");
        assert.strictEqual(php2.sourceContent, "<?php echo 'world<?php ?>'; ?>");
    });

    test('it resolves offsets correctly', () => {
        const nodes = BladeDocument.fromText(`a<?php ?>b<?php ?>c<?php ?>d`).getAllNodes();
        assertCount(7, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("a", nodes[0]);
        assertInstanceOf(InlinePhpNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent("b", nodes[2]);
        assertInstanceOf(InlinePhpNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("c", nodes[4]);
        assertInstanceOf(InlinePhpNode, nodes[5]);
        assertInstanceOf(LiteralNode, nodes[6]);
        assertLiteralContent("d", nodes[6]);
    });

    test('it resolves shorthand PHP offsets correctly', () => {
        const nodes = BladeDocument.fromText(`a<?= ?>b<?= ?>c<?= ?>d`).getAllNodes();
        assertCount(7, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("a", nodes[0]);
        assertInstanceOf(ShorthandInlinePhpNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent("b", nodes[2]);
        assertInstanceOf(ShorthandInlinePhpNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("c", nodes[4]);
        assertInstanceOf(ShorthandInlinePhpNode, nodes[5]);
        assertInstanceOf(LiteralNode, nodes[6]);
        assertLiteralContent("d", nodes[6]);
    });

    test('it resolves fragment positions', () => {
        const nodes = BladeDocument.fromText(`<<?php echo $element; ?>>
    <?php echo $inline; ?>
    <p>Text <?php echo $inline; ?> here.</p>
</<?php echo $element; ?>>`).getAllNodes();
        assertCount(9, nodes);

        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("<", nodes[0]);
        assertInstanceOf(InlinePhpNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent(">\n    ", nodes[2]);
        assertInstanceOf(InlinePhpNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("\n    <p>Text ", nodes[4]);
        assertInstanceOf(InlinePhpNode, nodes[5]);
        assertInstanceOf(LiteralNode, nodes[6]);
        assertLiteralContent(" here.</p>\n</", nodes[6]);
        assertInstanceOf(InlinePhpNode, nodes[7]);
        assertInstanceOf(LiteralNode, nodes[8]);
        assertLiteralContent(">", nodes[8]);

        const php1 = nodes[1] as InlinePhpNode,
            php2 = nodes[3] as InlinePhpNode,
            php3 = nodes[5] as InlinePhpNode,
            php4 = nodes[7] as InlinePhpNode;

        assert.strictEqual(php1.fragmentPosition, FragmentPosition.IsDynamicFragmentName, 'php1');
        assert.strictEqual(php2.fragmentPosition, FragmentPosition.Unresolved, 'php2');
        assert.strictEqual(php3.fragmentPosition, FragmentPosition.Unresolved, 'php3');
        assert.strictEqual(php4.fragmentPosition, FragmentPosition.IsDynamicFragmentName, 'php4');
    });

    test('it resolves shorthand PHP fragment positions', () => {
        const nodes = BladeDocument.fromText(`<<?= $element; ?>>
    <?= $inline; ?>
    <p>Text <?= $inline; ?> here.</p>
</<?= $element; ?>>`).getAllNodes();
        assertCount(9, nodes);

        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("<", nodes[0]);
        assertInstanceOf(ShorthandInlinePhpNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent(">\n    ", nodes[2]);
        assertInstanceOf(ShorthandInlinePhpNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("\n    <p>Text ", nodes[4]);
        assertInstanceOf(ShorthandInlinePhpNode, nodes[5]);
        assertInstanceOf(LiteralNode, nodes[6]);
        assertLiteralContent(" here.</p>\n</", nodes[6]);
        assertInstanceOf(ShorthandInlinePhpNode, nodes[7]);
        assertInstanceOf(LiteralNode, nodes[8]);
        assertLiteralContent(">", nodes[8]);

        const php1 = nodes[1] as ShorthandInlinePhpNode,
            php2 = nodes[3] as ShorthandInlinePhpNode,
            php3 = nodes[5] as ShorthandInlinePhpNode,
            php4 = nodes[7] as ShorthandInlinePhpNode;

        assert.strictEqual(php1.fragmentPosition, FragmentPosition.IsDynamicFragmentName, 'php1');
        assert.strictEqual(php2.fragmentPosition, FragmentPosition.Unresolved, 'php2');
        assert.strictEqual(php3.fragmentPosition, FragmentPosition.Unresolved, 'php3');
        assert.strictEqual(php4.fragmentPosition, FragmentPosition.IsDynamicFragmentName, 'php4');
    });
});