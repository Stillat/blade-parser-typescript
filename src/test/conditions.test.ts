import assert = require('assert');
import { BladeDocument } from '../document/bladeDocument';
import { AbstractNode, ConditionNode, DirectiveNode, ExecutionBranchNode, LiteralNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf, assertLiteralContent, assertNotNull } from './testUtils/assertions';

suite('Conditions Test', () => {
    test('it can parse basic conditions', () => {
        const nodes = BladeDocument.fromText(`before
@if (count($records) === 1)
    I have one record!
@elseif (count($records) > 1)
    I have multiple records!
@else
    I don't have any records!
@endif after`).getRenderNodes();
        assertCount(3, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(ConditionNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);

        assertLiteralContent("before\n", nodes[0]);
        assertLiteralContent("after", nodes[2]);

        const condition = nodes[1] as ConditionNode;

        assertCount(3, condition.chain);
        assert.strictEqual(condition.chain[0], 1);
        assert.strictEqual(condition.chain[1], 3);
        assert.strictEqual(condition.chain[2], 5);

        assertCount(3, condition.logicBranches);
        assertInstanceOf(ExecutionBranchNode, condition.logicBranches[0]);
        assertInstanceOf(ExecutionBranchNode, condition.logicBranches[1]);
        assertInstanceOf(ExecutionBranchNode, condition.logicBranches[2]);

        const branch1 = condition.logicBranches[0] as ExecutionBranchNode,
            branch2 = condition.logicBranches[1] as ExecutionBranchNode,
            branch3 = condition.logicBranches[2] as ExecutionBranchNode;

        assertNotNull(branch1.head);
        assertNotNull(branch2.head);
        assertNotNull(branch3.head);

        assertInstanceOf(DirectiveNode, branch1.head);
        assertInstanceOf(DirectiveNode, branch2.head);
        assertInstanceOf(DirectiveNode, branch3.head);

        const c1 = branch1.head?.children as AbstractNode[],
            c2 = branch2.head?.children as AbstractNode[],
            c3 = branch3.head?.children as AbstractNode[];

        assertCount(2, c1);
        assertCount(2, c2);
        assertCount(2, c3);

        assertInstanceOf(LiteralNode, c1[0]);
        assertInstanceOf(DirectiveNode, c1[1]);
        assertLiteralContent("\n    I have one record!\n", c1[0]);

        assertInstanceOf(LiteralNode, c2[0]);
        assertInstanceOf(DirectiveNode, c2[1]);
        assertLiteralContent("\n    I have multiple records!\n", c2[0]);

        assertInstanceOf(LiteralNode, c3[0]);
        assertInstanceOf(DirectiveNode, c3[1]);
        assertLiteralContent("\n    I don't have any records!\n", c3[0]);
    });

    test('it can detect custom conditions', () => {
        const nodes = BladeDocument.fromText(`@disk('local')
<!-- The application is using the local disk... -->
@elsedisk('s3')
<!-- The application is using the s3 disk... -->
@else
<!-- The application is using some other disk... -->
@enddisk`).getRenderNodes();
        assertCount(1, nodes);
        assertInstanceOf(ConditionNode, nodes[0]);

        const condition = nodes[0] as ConditionNode;

        assertCount(3, condition.chain);
        assert.strictEqual(condition.chain[0], 0);
        assert.strictEqual(condition.chain[1], 2);
        assert.strictEqual(condition.chain[2], 4);

        const branch1 = condition.logicBranches[0] as ExecutionBranchNode,
            branch2 = condition.logicBranches[1] as ExecutionBranchNode,
            branch3 = condition.logicBranches[2] as ExecutionBranchNode;

        assertNotNull(branch1.head);
        assertNotNull(branch2.head);
        assertNotNull(branch3.head);

        assertInstanceOf(DirectiveNode, branch1.head);
        assertInstanceOf(DirectiveNode, branch2.head);
        assertInstanceOf(DirectiveNode, branch3.head);

        const c1 = branch1.head?.children as AbstractNode[],
            c2 = branch2.head?.children as AbstractNode[],
            c3 = branch3.head?.children as AbstractNode[];

        assertCount(2, c1);
        assertCount(2, c2);
        assertCount(2, c3);

        assertInstanceOf(LiteralNode, c1[0]);
        assertInstanceOf(DirectiveNode, c1[1]);
        assertLiteralContent("\n<!-- The application is using the local disk... -->\n", c1[0]);

        assertInstanceOf(LiteralNode, c2[0]);
        assertInstanceOf(DirectiveNode, c2[1]);
        assertLiteralContent("\n<!-- The application is using the s3 disk... -->\n", c2[0]);

        assertInstanceOf(LiteralNode, c3[0]);
        assertInstanceOf(DirectiveNode, c3[1]);
        assertLiteralContent("\n<!-- The application is using some other disk... -->\n", c3[0]);
    });

    test('it can parse unless', () => {
        const nodes = BladeDocument.fromText(`@unless (Auth::check())
You are not signed in.
@endunless`).getRenderNodes();
        assertCount(1, nodes);
        assertInstanceOf(ConditionNode, nodes[0]);

        const cond = nodes[0] as ConditionNode;
        assertCount(1, cond.logicBranches);

        const branchOne = cond.logicBranches[0] as ExecutionBranchNode;
        assertCount(2, branchOne.nodes);
        assertInstanceOf(LiteralNode, branchOne.nodes[0]);
        assertLiteralContent("\nYou are not signed in.\n", branchOne.nodes[0]);
        assertInstanceOf(DirectiveNode, branchOne.nodes[1]);

        assertNotNull(branchOne.childDocument);
        assert.strictEqual(branchOne.childDocument?.content, "\nYou are not signed in.\n");
    });
});