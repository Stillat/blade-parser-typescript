import { BladeDocument } from '../document/bladeDocument';
import { ConditionNode, LiteralNode } from '../nodes/nodes';
import { ParserOptions } from '../parser/parserOptions';
import { assertCount, assertInstanceOf } from './testUtils/assertions';

suite('Custom If Statements', () => {
    test('it can parse configured custom ifs', () => {
        const options: ParserOptions = {
            ignoreDirectives: [],
            customIfs: ['otherDisk'],
            directives: []
        };

        const doc = new BladeDocument();
        doc.getParser().withParserOptions(options);

        const nodes = doc.loadString(`

        @otherDisk($test)
        
        
        @endotherDisk
        
        `).getRenderNodes();

        assertCount(3, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(ConditionNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
    });
});