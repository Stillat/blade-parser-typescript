import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument';
import { BladeEchoNode, DirectiveNode, LiteralNode } from '../nodes/nodes';
import { ParserOptions } from '../parser/parserOptions';
import { assertCount, assertInstanceOf, assertLiteralContent } from './testUtils/assertions';

suite('Exclusive Directives Parsing', () => {
    test('a list can be provided to specify what is a valid directive', () => {
        const doc = new BladeDocument(),
            options: ParserOptions = {
                customIfs: [],
                ignoreDirectives: [],
                directives: [
                    'myDirective'
                ]
            };
        doc.getParser().withParserOptions(options);
        doc.loadString(`


@myDirective()

@if($true)
<span>Hello</span>
@elseif($anotherValue)
<div>
    <p>Hello world</p>
    <div>
    @pair
        Test

@endpair
    </div>
    </div>
@else

<p>Test {{ $title}}     test
        </p>

@endif

`);
        const nodes = doc.getAllNodes();
        assertCount(5, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("\n\n\n", nodes[0]);
        assertInstanceOf(DirectiveNode, nodes[1]);

        const directive = nodes[1] as DirectiveNode;
        assert.strictEqual(directive.directiveName, 'myDirective');

        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent("\n\n@if($true)\n<span>Hello</span>\n@elseif($anotherValue)\n<div>\n    <p>Hello world</p>\n    <div>\n    @pair\n        Test\n\n@endpair\n    </div>\n    </div>\n@else\n\n<p>Test ", nodes[2]);
        assertInstanceOf(BladeEchoNode, nodes[3]);

        const echo = nodes[3] as BladeEchoNode;
        assert.strictEqual(echo.sourceContent, "{{ $title}}");

        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("     test\n        </p>\n\n@endif\n\n", nodes[4]);
    });
});