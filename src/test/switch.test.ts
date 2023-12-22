import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { AbstractNode, DirectiveNode, LiteralNode, SwitchCaseNode, SwitchStatementNode } from '../nodes/nodes.js';
import { assertCount, assertInstanceOf, assertLiteralContent, assertNotNull, assertPaired } from './testUtils/assertions.js';

suite('Switch Statements', () => {
    test('it can parse switch statements', () => {
        const nodes = BladeDocument.fromText(`@switch($i)
@case(1)
    First case...
    @break

@case(2)
    Second case...
    @break

@default
    Default case...
@endswitch`).getRenderNodes();
        assertCount(1, nodes);
        assertInstanceOf(SwitchStatementNode, nodes[0]);

        const switchStatement = nodes[0] as SwitchStatementNode;
        assertCount(3, switchStatement.cases);
        assertInstanceOf(SwitchCaseNode, switchStatement.cases[0]);
        assertInstanceOf(SwitchCaseNode, switchStatement.cases[1]);
        assertInstanceOf(SwitchCaseNode, switchStatement.cases[2]);

        assertNotNull(switchStatement.tail);
        assertInstanceOf(DirectiveNode, switchStatement.tail);

        const switchTail = switchStatement.tail as DirectiveNode;

        assert.strictEqual(switchTail.directiveName, 'endswitch');

        const case1 = switchStatement.cases[0] as SwitchCaseNode,
            case2 = switchStatement.cases[1] as SwitchCaseNode,
            case3 = switchStatement.cases[2] as SwitchCaseNode;
        assert.strictEqual(case1.index, case1.head?.index);
        assert.strictEqual(case2.index, case2.head?.index);
        assert.strictEqual(case3.index, case3.head?.index);
        assert.strictEqual(case1.refId, case1.head?.refId);
        assert.strictEqual(case2.refId, case2.head?.refId);
        assert.strictEqual(case3.refId, case3.head?.refId);

        assert.strictEqual(case1.order, 0);
        assert.strictEqual(case2.order, 1);
        assert.strictEqual(case3.order, 2);

        assert.strictEqual(case1.isDefault, false);
        assert.strictEqual(case2.isDefault, false);
        assert.strictEqual(case3.isDefault, true);

        assertCount(3, case1.children);
        assertCount(3, case2.children);
        assertCount(1, case3.children);

        assertCount(1, case1.leadingNodes);
        assertCount(0, case2.leadingNodes);
        assertCount(0, case3.leadingNodes);

        assertLiteralContent("\n", case1.leadingNodes[0]);

        const c1c = case1.children as AbstractNode[],
            c2c = case2.children as AbstractNode[],
            c3c = case3.children as AbstractNode[];

        assertInstanceOf(LiteralNode, c1c[0]);
        assertLiteralContent("\n    First case...\n    ", c1c[0]);

        assertInstanceOf(DirectiveNode, c1c[1]);
        const c1cd = c1c[1] as DirectiveNode;
        assert.strictEqual(c1cd.directiveName, 'break');

        assertInstanceOf(LiteralNode, c1c[2]);
        assertLiteralContent("\n\n", c1c[2]);

        assertInstanceOf(LiteralNode, c2c[0]);
        assertLiteralContent("\n    Second case...\n    ", c2c[0]);
        assertInstanceOf(DirectiveNode, c2c[1]);
        const c2cd = c2c[1] as DirectiveNode;
        assert.strictEqual(c2cd.directiveName, 'break');
        assertInstanceOf(LiteralNode, c2c[2]);
        assertLiteralContent("\n\n", c2c[2]);

        assertInstanceOf(LiteralNode, c3c[0]);
        assertLiteralContent("\n    Default case...\n", c3c[0]);
    });

    test('switch pairing', () => {
        const nodes = BladeDocument.fromText(`@switch($i)
@case(1)
    First case
    @break

@case(2)
    Second case
    @switch($i2)
        @case(21)
            First case two
            
            @switch($i3)
                @case(31)
                    First case three
                    @break

                @case(32)
                    Second case three
                    @break

                @default
                    Default case three
            @endswitch

            @break

        @case(22)
            Second case two.
            @break

        @default
            Default case two
    @endswitch
    End Second
    @break

@default
    Default case
@endswitch`).getAllNodes();
        assertCount(41, nodes);
        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);
        assertInstanceOf(LiteralNode, nodes[3]);
        assertInstanceOf(DirectiveNode, nodes[4]);
        assertInstanceOf(LiteralNode, nodes[5]);
        assertInstanceOf(DirectiveNode, nodes[6]);
        assertInstanceOf(LiteralNode, nodes[7]);
        assertInstanceOf(DirectiveNode, nodes[8]);
        assertInstanceOf(LiteralNode, nodes[9]);
        assertInstanceOf(DirectiveNode, nodes[10]);
        assertInstanceOf(LiteralNode, nodes[11]);
        assertInstanceOf(DirectiveNode, nodes[12]);
        assertInstanceOf(LiteralNode, nodes[13]);
        assertInstanceOf(DirectiveNode, nodes[14]);
        assertInstanceOf(LiteralNode, nodes[15]);
        assertInstanceOf(DirectiveNode, nodes[16]);
        assertInstanceOf(LiteralNode, nodes[17]);
        assertInstanceOf(DirectiveNode, nodes[18]);
        assertInstanceOf(LiteralNode, nodes[19]);
        assertInstanceOf(DirectiveNode, nodes[20]);
        assertInstanceOf(LiteralNode, nodes[21]);
        assertInstanceOf(DirectiveNode, nodes[22]);
        assertInstanceOf(LiteralNode, nodes[23]);
        assertInstanceOf(DirectiveNode, nodes[24]);
        assertInstanceOf(LiteralNode, nodes[25]);
        assertInstanceOf(DirectiveNode, nodes[26]);
        assertInstanceOf(LiteralNode, nodes[27]);
        assertInstanceOf(DirectiveNode, nodes[28]);
        assertInstanceOf(LiteralNode, nodes[29]);
        assertInstanceOf(DirectiveNode, nodes[30]);
        assertInstanceOf(LiteralNode, nodes[31]);
        assertInstanceOf(DirectiveNode, nodes[32]);
        assertInstanceOf(LiteralNode, nodes[33]);
        assertInstanceOf(DirectiveNode, nodes[34]);
        assertInstanceOf(LiteralNode, nodes[35]);
        assertInstanceOf(DirectiveNode, nodes[36]);
        assertInstanceOf(LiteralNode, nodes[37]);
        assertInstanceOf(DirectiveNode, nodes[38]);
        assertInstanceOf(LiteralNode, nodes[39]);
        assertInstanceOf(DirectiveNode, nodes[40]);

        assertPaired(nodes[0], nodes[40]);
        assertPaired(nodes[8], nodes[34]);
        assertPaired(nodes[12], nodes[24]);
    });

    test('it parses nested documents', () => {
        const nodes = BladeDocument.fromText(`@switch($i)
@case(1)
    First case
    @break

@case(2)
    Second case
    @switch($i2)
        @case(21)
            First case two
            
            @switch($i3)
                @case(31)
                    First case three
                    @break

                @case(32)
                    Second case three
                    @break

                @default
                    Default case three
            @endswitch

            @break

        @case(22)
            Second case two.
            @break

        @default
            Default case two
    @endswitch
    End Second
    @break

@default
    Default case
@endswitch`).getRenderNodes();
        assertCount(1, nodes);
        assertInstanceOf(SwitchStatementNode, nodes[0]);

        const firstSwitch = nodes[0] as SwitchStatementNode;
        assert.strictEqual(firstSwitch.nodeContent, "@switch($i)\n@case(1)\n    First case\n    @break\n\n@case(2)\n    Second case\n    @switch($i2)\n        @case(21)\n            First case two\n            \n            @switch($i3)\n                @case(31)\n                    First case three\n                    @break\n\n                @case(32)\n                    Second case three\n                    @break\n\n                @default\n                    Default case three\n            @endswitch\n\n            @break\n\n        @case(22)\n            Second case two.\n            @break\n\n        @default\n            Default case two\n    @endswitch\n    End Second\n    @break\n\n@default\n    Default case\n@endswitch");
        assertCount(3, firstSwitch.cases);

        const s1Case1 = firstSwitch.cases[0],
            s1Case2 = firstSwitch.cases[1],
            s1Case3 = firstSwitch.cases[2];
        assertCount(3, s1Case1.children);
        assertNotNull(s1Case1.childDocument);
        assert.strictEqual(s1Case1.childDocument?.content, "\n    First case\n    @break\n\n");

        assertNotNull(s1Case3.childDocument);
        assertCount(1, s1Case3.children);
        assert.strictEqual(s1Case3.childDocument?.content, "\n    Default case\n");
        assertLiteralContent("\n    Default case\n", s1Case3.children[0]);

        const s1Case2Children = s1Case2.children;
        assertCount(31, s1Case2Children);
        assertNotNull(s1Case2.childDocument);
        assert.strictEqual(s1Case2.childDocument?.content, "\n    Second case\n    @switch($i2)\n        @case(21)\n            First case two\n            \n            @switch($i3)\n                @case(31)\n                    First case three\n                    @break\n\n                @case(32)\n                    Second case three\n                    @break\n\n                @default\n                    Default case three\n            @endswitch\n\n            @break\n\n        @case(22)\n            Second case two.\n            @break\n\n        @default\n            Default case two\n    @endswitch\n    End Second\n    @break\n\n");

        const s1Case2Nodes = s1Case2.childDocument.renderNodes as AbstractNode[];
        assertCount(5, s1Case2Nodes);

        assertInstanceOf(LiteralNode, s1Case2Nodes[0]);
        assertLiteralContent("\n    Second case\n    ", s1Case2Nodes[0]);
        assertInstanceOf(SwitchStatementNode, s1Case2Nodes[1]);
        assertInstanceOf(LiteralNode, s1Case2Nodes[2]);
        assertLiteralContent("\n    End Second\n    ", s1Case2Nodes[2]);
        assertInstanceOf(DirectiveNode, s1Case2Nodes[3]);
        const s1Case2D1 = s1Case2Nodes[3] as DirectiveNode;
        assert.strictEqual(s1Case2D1.directiveName, 'break');
        assertInstanceOf(LiteralNode, s1Case2Nodes[4]);
        assertLiteralContent("\n", s1Case2Nodes[4]);

        const switchTwo = s1Case2Nodes[1] as SwitchStatementNode;
        assertCount(3, switchTwo.cases);
        assert.strictEqual(switchTwo.nodeContent, "@switch($i2)\n        @case(21)\n            First case two\n            \n            @switch($i3)\n                @case(31)\n                    First case three\n                    @break\n\n                @case(32)\n                    Second case three\n                    @break\n\n                @default\n                    Default case three\n            @endswitch\n\n            @break\n\n        @case(22)\n            Second case two.\n            @break\n\n        @default\n            Default case two\n    @endswitch");

        const s2case1 = switchTwo.cases[0],
            s2Case2 = switchTwo.cases[1],
            s2Case3 = switchTwo.cases[2];

        assertCount(17, s2case1.children);
        assertCount(3, s2Case2.children);

        assertInstanceOf(LiteralNode, s2Case2.children[0]);
        assertLiteralContent("\n            Second case two.\n            ", s2Case2.children[0]);
        assertInstanceOf(DirectiveNode, s2Case2.children[1]);
        const s2Case2D1 = s2Case2.children[1] as DirectiveNode;
        assert.strictEqual(s2Case2D1.directiveName, 'break');
        assertInstanceOf(LiteralNode, s2Case2.children[2]);
        assertLiteralContent("\n\n        ", s2Case2.children[2]);

        assertCount(1, s2Case3.children);
        assertLiteralContent("\n            Default case two\n    ", s2Case3.children[0]);

        assertNotNull(s2case1.childDocument);
        assert.strictEqual(s2case1.childDocument?.content, "\n            First case two\n            \n            @switch($i3)\n                @case(31)\n                    First case three\n                    @break\n\n                @case(32)\n                    Second case three\n                    @break\n\n                @default\n                    Default case three\n            @endswitch\n\n            @break\n\n        ");

        const s2Case1Children = s2case1.childDocument.renderNodes as AbstractNode[];

        assertCount(5, s2Case1Children);
        assertInstanceOf(LiteralNode, s2Case1Children[0]);
        assertLiteralContent("\n            First case two\n            \n            ", s2Case1Children[0]);
        assertInstanceOf(SwitchStatementNode, s2Case1Children[1]);
        assertInstanceOf(LiteralNode, s2Case1Children[2]);
        assertLiteralContent("\n\n            ", s2Case1Children[2]);
        assertInstanceOf(DirectiveNode, s2Case1Children[3]);
        const s1Case1D1 = s2Case1Children[3] as DirectiveNode;
        assert.strictEqual(s1Case1D1.directiveName, 'break');
        assertInstanceOf(LiteralNode, s2Case1Children[4]);
        assertLiteralContent("\n        ", s2Case1Children[4]);

        const switchThree = s2Case1Children[1] as SwitchStatementNode;
        assertCount(3, switchThree.cases);
        assert.strictEqual(switchThree.nodeContent, "@switch($i3)\n                @case(31)\n                    First case three\n                    @break\n\n                @case(32)\n                    Second case three\n                    @break\n\n                @default\n                    Default case three\n            @endswitch");

        const s3c1 = switchThree.cases[0],
            s3c2 = switchThree.cases[1],
            s3c3 = switchThree.cases[2];

        assertCount(3, s3c1.children);
        assertNotNull(s3c1.childDocument);
        assert.strictEqual(s3c1.childDocument?.content, "\n                    First case three\n                    @break\n\n                ");
        assertInstanceOf(LiteralNode, s3c1.children[0]);
        assertLiteralContent("\n                    First case three\n                    ", s3c1.children[0]);
        assertInstanceOf(DirectiveNode, s3c1.children[1]);
        const c3c1d1 = s3c1.children[1] as DirectiveNode;
        assert.strictEqual(c3c1d1.directiveName, 'break');
        assertInstanceOf(LiteralNode, s3c1.children[2]);
        assertLiteralContent("\n\n                ", s3c1.children[2]);

        assertCount(3, s3c2.children);
        assertNotNull(s3c2.childDocument);
        assert.strictEqual(s3c2.childDocument?.content, "\n                    Second case three\n                    @break\n\n                ");
        assertInstanceOf(LiteralNode, s3c2.children[0]);
        assertLiteralContent("\n                    Second case three\n                    ", s3c2.children[0]);
        assertInstanceOf(DirectiveNode, s3c2.children[1]);
        const s3c2d1 = s3c2.children[1] as DirectiveNode;
        assert.strictEqual(s3c2d1.directiveName, 'break');
        assertInstanceOf(LiteralNode, s3c2.children[2]);
        assertLiteralContent("\n\n                ", s3c2.children[2]);

        assertCount(1, s3c3.children);
        assertNotNull(s3c3.childDocument);
        assert.strictEqual(s3c3.childDocument?.content, "\n                    Default case three\n            ");
        assertInstanceOf(LiteralNode, s3c3.children[0]);
        assertLiteralContent("\n                    Default case three\n            ", s3c3.children[0]);
    });
});