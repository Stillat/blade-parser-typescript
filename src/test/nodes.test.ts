import assert from 'assert';
import { BladeDocument } from '../document/bladeDocument.js';
import { BladeCommentNode, BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode, ConditionNode, DirectiveNode, LiteralNode } from '../nodes/nodes.js';
import { assertCount, assertEchoContent, assertInstanceOf, assertLiteralContent } from './testUtils/assertions.js';

suite('Blade Nodes Test', () => {
    test('it parses simple nodes', () => {
        const template = `start {{ $variable }} end`,
            document = BladeDocument.fromText(template),
            nodes = document.getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);

        const literalOne = nodes[0] as LiteralNode,
            echoOne = nodes[1] as BladeEchoNode,
            literalTwo = nodes[2] as LiteralNode;
        assert.strictEqual(literalOne.content, 'start ');
        assert.strictEqual(echoOne.content, ' $variable ');
        assert.strictEqual(echoOne.sourceContent, '{{ $variable }}');
        assert.strictEqual(literalTwo.content, ' end');
    });

    test('it ignores escaped nodes', () => {
        const nodes = BladeDocument.fromText(`
@@unless
@{{ $variable }}
@{!! $variable }}
`).getRenderNodes();
        assertCount(1, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("\n@@unless\n@{{ $variable }}\n@{!! $variable }}\n", nodes[0]);
    });

    test('it ignores escaped nodes mixed with other nodes', () => {
        const nodes = BladeDocument.fromText(`
@@unless
@{{ $variable }}
@{!! $variable }}

{{ test }}


@{!! $variable }}

    {{ another }}
`).getAllNodes();
        assertCount(5, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertInstanceOf(BladeEchoNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("\n@@unless\n@{{ $variable }}\n@{!! $variable }}\n\n", nodes[0]);
        assertLiteralContent("\n\n\n@{!! $variable }}\n\n    ", nodes[2]);
        assertLiteralContent("\n", nodes[4]);
    });

    test('it parses many nodes', () => {
        const template = `start
    {{-- comment!!! --}}3
    s1@props-two(['color' => (true ?? 'gray')])
    s2@directive
    @directive something
    s3@props-three  (['color' => (true ?? 'gray')])
    @props(['color' => 'gray'])
 {!! $dooblyDoo !!}1
<ul {{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}>
    {{ $slot }}
</ul>`,
            document = BladeDocument.fromText(template),
            nodes = document.getAllNodes();
        assertCount(19, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("start\n    ", nodes[0]);

        assertInstanceOf(BladeCommentNode, nodes[1]);
        const comment = nodes[1] as BladeCommentNode;
        assert.strictEqual(comment.innerContent, ' comment!!! ');
        assert.strictEqual(comment.sourceContent, "{{-- comment!!! --}}");

        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent("3\n    s1", nodes[2]);

        assertInstanceOf(DirectiveNode, nodes[3]);
        const directiveOne = nodes[3] as DirectiveNode;
        assert.strictEqual(directiveOne.directiveName, 'props-two');
        assert.strictEqual(directiveOne.directiveParameters, "(['color' => (true ?? 'gray')])");
        assert.strictEqual(directiveOne.sourceContent, "@props-two(['color' => (true ?? 'gray')])");
        assert.strictEqual(directiveOne.hasDirectiveParameters, true);

        assertInstanceOf(LiteralNode, nodes[4]);
        assertLiteralContent("\n    s2", nodes[4]);

        assertInstanceOf(DirectiveNode, nodes[5]);
        const directiveTwo = nodes[5] as DirectiveNode;
        assert.strictEqual(directiveTwo.directiveName, 'directive');
        assert.strictEqual(directiveTwo.directiveParameters, '');
        assert.strictEqual(directiveTwo.sourceContent, "@directive");
        assert.strictEqual(directiveTwo.hasDirectiveParameters, false);

        assertInstanceOf(LiteralNode, nodes[6]);
        assertLiteralContent("\n    ", nodes[6]);

        assertInstanceOf(DirectiveNode, nodes[7]);
        const directiveThree = nodes[7] as DirectiveNode;
        assert.strictEqual(directiveThree.directiveName, 'directive');
        assert.strictEqual(directiveThree.directiveParameters, '');
        assert.strictEqual(directiveThree.sourceContent, "@directive");
        assert.strictEqual(directiveThree.hasDirectiveParameters, false);

        assertInstanceOf(LiteralNode, nodes[8]);
        assertLiteralContent("something\n    s3", nodes[8]);

        assertInstanceOf(DirectiveNode, nodes[9]);
        const directiveFour = nodes[9] as DirectiveNode;
        assert.strictEqual(directiveFour.directiveName, 'props-three');
        assert.strictEqual(directiveFour.directiveParameters, "(['color' => (true ?? 'gray')])");
        assert.strictEqual(directiveFour.sourceContent, "@props-three  (['color' => (true ?? 'gray')])");
        assert.strictEqual(directiveFour.hasDirectiveParameters, true);

        assertInstanceOf(LiteralNode, nodes[10]);
        assertLiteralContent("\n    ", nodes[10]);

        assertInstanceOf(DirectiveNode, nodes[11]);
        const directiveFive = nodes[11] as DirectiveNode;
        assert.strictEqual(directiveFive.directiveName, 'props');
        assert.strictEqual(directiveFive.directiveParameters, "(['color' => 'gray'])");
        assert.strictEqual(directiveFive.sourceContent, "@props(['color' => 'gray'])");
        assert.strictEqual(directiveFive.hasDirectiveParameters, true);

        assertInstanceOf(LiteralNode, nodes[12]);
        assertLiteralContent("\n ", nodes[12]);

        assertInstanceOf(BladeEscapedEchoNode, nodes[13]);
        const echoNode = nodes[13] as BladeEscapedEchoNode;
        assert.strictEqual(echoNode.content, ' $dooblyDoo ');
        assert.strictEqual(echoNode.sourceContent, '{!! $dooblyDoo !!}');

        assertInstanceOf(LiteralNode, nodes[14]);
        assertLiteralContent("1\n<ul ", nodes[14]);

        assertInstanceOf(BladeEchoNode, nodes[15]);
        const echoNodeTwo = nodes[15] as BladeEchoNode;
        assert.strictEqual(echoNodeTwo.content, " $attributes->merge(['class' => 'bg-'.$color.'-200']) ");
        assert.strictEqual(echoNodeTwo.sourceContent, "{{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}");

        assertInstanceOf(LiteralNode, nodes[16]);
        assertLiteralContent(">\n    ", nodes[16]);

        assertInstanceOf(BladeEchoNode, nodes[17]);
        const echoNodeThree = nodes[17] as BladeEchoNode;
        assert.strictEqual(echoNodeThree.content, ' $slot ');
        assert.strictEqual(echoNodeThree.sourceContent, '{{ $slot }}');

        assertInstanceOf(LiteralNode, nodes[18]);
        assertLiteralContent("\n</ul>", nodes[18]);
    });

    test('template one', () => {
        const nodes = BladeDocument.fromText(`The current UNIX timestamp is {{ time() }}.`).getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);

        assertLiteralContent("The current UNIX timestamp is ", nodes[0]);
        assertEchoContent(nodes[1] as BladeEchoNode, ' time() ', '{{ time() }}');
        assertLiteralContent('.', nodes[2]);
    });

    test('template two', () => {
        const nodes = BladeDocument.fromText(`Hello, {!! $name !!}.`).getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(BladeEscapedEchoNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);

        assertLiteralContent("Hello, ", nodes[0]);
        assertEchoContent(nodes[1] as BladeEchoNode, ' $name ', '{!! $name !!}');
        assertLiteralContent('.', nodes[2]);
    });

    test('template three', () => {
        const nodes = BladeDocument.fromText(`<h1>Laravel</h1>
 
Hello, @{{ name }}.`).getAllNodes();

        assertCount(1, nodes);
        assertLiteralContent("<h1>Laravel</h1>\n \nHello, @{{ name }}.", nodes[0]);
    });

    test('template four', () => {
        const nodes = BladeDocument.fromText('@@if').getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);

        assertLiteralContent('@@if', nodes[0]);
    });

    test('template five', () => {
        const nodes = BladeDocument.fromText(`<script>
var app = {{ Illuminate\\Support\\Js::from($array) }};
</script>`).getAllNodes();
        assertCount(3, nodes);

        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("<script>\nvar app = ", nodes[0]);

        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertEchoContent(
            nodes[1] as BladeEchoNode,
            " Illuminate\\Support\\Js::from($array) ",
            "{{ Illuminate\\Support\\Js::from($array) }}"
        );

        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent(";\n</script>", nodes[2]);
    });

    test('template six', () => {
        const nodes = BladeDocument.fromText(`<script>
var app = {{ Js::from($array) }};
</script>`).getAllNodes();
        assertCount(3, nodes);

        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("<script>\nvar app = ", nodes[0]);

        assertInstanceOf(BladeEchoNode, nodes[1]);
        assertEchoContent(
            nodes[1] as BladeEchoNode,
            " Js::from($array) ",
            "{{ Js::from($array) }}"
        );

        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent(";\n</script>", nodes[2]);
    });

    test('template seven', () => {
        const nodes = BladeDocument.fromText(`@verbatim
<div class="container">
    Hello, {{ name }}.
</div>
@endverbatim`).getAllNodes();
        assertCount(2, nodes);

        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(DirectiveNode, nodes[1]);

        const directiveOne = nodes[0] as DirectiveNode,
            directiveTwo = nodes[1] as DirectiveNode;


        assert.strictEqual(directiveOne.sourceContent, '@verbatim');
        assert.strictEqual(directiveOne.directiveName, 'verbatim');
        assert.strictEqual(directiveOne.innerContent, "\n<div class=\"container\">\n    Hello, {{ name }}.\n</div>\n");

        assert.strictEqual(directiveTwo.sourceContent, '@endverbatim');
        assert.strictEqual(directiveTwo.directiveName, 'endverbatim');
    });

    test('template eight', () => {
        const nodes = BladeDocument.fromText(`@if (count($records) === 1)
I have one record!
@elseif (count($records) > 1)
I have multiple records!
@else
I don't have any records!
@endif`).getAllNodes();
        assertCount(7, nodes);

        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);
        assertInstanceOf(LiteralNode, nodes[3]);
        assertInstanceOf(DirectiveNode, nodes[4]);
        assertInstanceOf(LiteralNode, nodes[5]);
        assertInstanceOf(DirectiveNode, nodes[6]);

        assertLiteralContent("\nI have one record!\n", nodes[1]);
        assertLiteralContent("\nI have multiple records!\n", nodes[3]);
        assertLiteralContent("\nI don't have any records!\n", nodes[5]);

        const directiveOne = nodes[0] as DirectiveNode,
            directiveTwo = nodes[2] as DirectiveNode,
            directiveThree = nodes[4] as DirectiveNode,
            directiveFour = nodes[6] as DirectiveNode;

        assert.strictEqual(directiveOne.directiveName, 'if');
        assert.strictEqual(directiveOne.directiveParameters, "(count($records) === 1)");
        assert.strictEqual(directiveOne.sourceContent, "@if (count($records) === 1)");
        assert.strictEqual(directiveOne.hasDirectiveParameters, true);

        assert.strictEqual(directiveTwo.directiveName, 'elseif');
        assert.strictEqual(directiveTwo.directiveParameters, "(count($records) > 1)");
        assert.strictEqual(directiveTwo.sourceContent, "@elseif (count($records) > 1)");
        assert.strictEqual(directiveTwo.hasDirectiveParameters, true);

        assert.strictEqual(directiveThree.directiveName, 'else');
        assert.strictEqual(directiveThree.directiveParameters, '');
        assert.strictEqual(directiveThree.sourceContent, "@else");
        assert.strictEqual(directiveThree.hasDirectiveParameters, false);

        assert.strictEqual(directiveFour.directiveName, 'endif');
        assert.strictEqual(directiveFour.directiveParameters, '');
        assert.strictEqual(directiveFour.sourceContent, "@endif");
        assert.strictEqual(directiveFour.hasDirectiveParameters, false);
    });

    test('template nine', () => {
        const nodes = BladeDocument.fromText(`@unless (Auth::check())
You are not signed in.
@endunless`).getAllNodes();
        assertCount(3, nodes);

        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(DirectiveNode, nodes[2]);

        assertLiteralContent("\nYou are not signed in.\n", nodes[1]);

        const directiveOne = nodes[0] as DirectiveNode,
            directiveTwo = nodes[2] as DirectiveNode;

        assert.strictEqual(directiveOne.directiveName, 'unless');
        assert.strictEqual(directiveOne.directiveParameters, "(Auth::check())");
        assert.strictEqual(directiveOne.sourceContent, "@unless (Auth::check())");
        assert.strictEqual(directiveOne.hasDirectiveParameters, true);

        assert.strictEqual(directiveTwo.directiveName, 'endunless');
        assert.strictEqual(directiveTwo.directiveParameters, '');
        assert.strictEqual(directiveTwo.sourceContent, "@endunless");
        assert.strictEqual(directiveTwo.hasDirectiveParameters, false);
    });

    test('template ten', () => {
        const nodes = BladeDocument.fromText(`@isset($records)
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
        assert.strictEqual(directiveOne.directiveParameters, "($records)");
        assert.strictEqual(directiveOne.sourceContent, "@isset($records)");
        assert.strictEqual(directiveOne.hasDirectiveParameters, true);

        assert.strictEqual(directiveTwo.directiveName, 'endisset');
        assert.strictEqual(directiveTwo.directiveParameters, '');
        assert.strictEqual(directiveTwo.sourceContent, "@endisset");
        assert.strictEqual(directiveTwo.hasDirectiveParameters, false);
    });

    test('template 11', () => {
        const nodes = BladeDocument.fromText('{{ $name }}').getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(BladeEchoNode, nodes[0]);
        const echo = nodes[0] as BladeEchoNode;

        assert.strictEqual(echo.content, ' $name ');
        assert.strictEqual(echo.sourceContent, '{{ $name }}');
    });

    test('template 12', () => {
        const nodes = BladeDocument.fromText('{{{ $name }}}').getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(BladeEntitiesEchoNode, nodes[0]);
        const echo = nodes[0] as BladeEntitiesEchoNode;

        assert.strictEqual(echo.content, ' $name ');
        assert.strictEqual(echo.sourceContent, '{{{ $name }}}');
    });

    test('template 11', () => {
        const nodes = BladeDocument.fromText(`{{
         $name
 }}`).getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(BladeEchoNode, nodes[0]);
        const echo = nodes[0] as BladeEchoNode;

        assert.strictEqual(echo.content, "\n         $name\n ");
        assert.strictEqual(echo.sourceContent, "{{\n         $name\n }}");
    });

    test('simple directives', () => {
        const simpleDirectives: string[] = [
            '@append',
            '@break',
            '@endfor',
            '@elsecanany',
            '@canany',
            '@endcannot',
            '@can',
            '@endcan',
        ];

        const contentDirectives: SimpleTemplate[] = [
            { content: '@break(TRUE)', name: 'break', params: '(TRUE)' },
            { content: '@break(2)', name: 'break', params: '(2)' },
            { content: '@break(-2)', name: 'break', params: '(-2)' },
            { content: '@break( 2 )', name: 'break', params: '( 2 )' },
            { content: '@canany ([\'create\', \'update\'], [$post])', name: 'canany', params: '([\'create\', \'update\'], [$post])' },
            { content: '@for ($i = 0; $i < 10; $i++)', name: 'for', params: '($i = 0; $i < 10; $i++)' },
            { content: '@cannot (\'update\', [$post])', name: 'cannot', params: '(\'update\', [$post])' },
            { content: '@elsecannot(\'delete\', [$post])', name: 'elsecannot', params: '(\'delete\', [$post])' },
            { content: '@can (\'update\', [$post])', name: 'can', params: '(\'update\', [$post])' },
            { content: '@selected(name(foo(bar)))', name: 'selected', params: '(name(foo(bar)))' },
            { content: '@disabled(name(foo(bar)))', name: 'disabled', params: '(name(foo(bar)))' },
            { content: "@class(['font-bold', 'mt-4', 'ml-2' => true, 'mr-2' => false])", name: 'class', params: "(['font-bold', 'mt-4', 'ml-2' => true, 'mr-2' => false])" },
            { content: '@componentFirst(["one", "two"])', name: 'componentFirst', params: '(["one", "two"])' },
            { content: '@componentFirst(["one", "two"], ["foo" => "bar"])', name: 'componentFirst', params: '(["one", "two"], ["foo" => "bar"])' },
            { content: '@componentFirst  (["one", "two"], ["foo" => "bar"])', name: 'componentFirst', params: '(["one", "two"], ["foo" => "bar"])' },
            { content: '@slot(\'foo\', null, ["foo" => "bar"])', name: 'slot', params: '(\'foo\', null, ["foo" => "bar"])' },
        ];

        simpleDirectives.forEach((directive) => {
            const nodes = BladeDocument.fromText(directive).getAllNodes();
            assertCount(1, nodes);
            assertInstanceOf(DirectiveNode, nodes[0]);
            const directiveNode = nodes[0] as DirectiveNode;

            assert.strictEqual(directiveNode.directiveName, directive.substring(1), 'simple directive name: ' + directive);
            assert.strictEqual(directiveNode.hasDirectiveParameters, false, 'simple directive has params: ' + directive);
            assert.strictEqual(directiveNode.sourceContent, directive, 'simple directive source content: ' + directive);
        });

        contentDirectives.forEach((directive) => {
            const nodes = BladeDocument.fromText(directive.content).getAllNodes();
            assertCount(1, nodes);
            assertInstanceOf(DirectiveNode, nodes[0]);
            const directiveNode = nodes[0] as DirectiveNode;

            assert.strictEqual(directiveNode.directiveName, directive.name, 'simple directive name: ' + directive.name);
            assert.strictEqual(directiveNode.hasDirectiveParameters, true, 'simple directive has params: ' + directive.name);
            assert.strictEqual(directiveNode.directiveParameters, directive.params, 'simple directive params: ' + directive.name);
            assert.strictEqual(directiveNode.sourceContent, directive.content, 'simple directive source content: ' + directive.name);
        });
    });

    test('Blade inside PHP directive', () => {
        const nodes = BladeDocument.fromText(`@php echo 'I am PHP {{ not Blade }}' @endphp`).getAllNodes();
        assertCount(2, nodes);
        assertInstanceOf(DirectiveNode, nodes[0]);
        assertInstanceOf(DirectiveNode, nodes[1]);

        const directive = nodes[0] as DirectiveNode;

        assert.strictEqual(directive.innerContent, " echo 'I am PHP {{ not Blade }}' ");
    });

    test('it parses inline directives', () => {
        const nodes = BladeDocument.fromText(`<div @if(true) yes @endif></div>`).getRenderNodes();
        assertCount(3, nodes);
        assertInstanceOf(LiteralNode, nodes[0]);
        assertLiteralContent("<div ", nodes[0]);
        assertInstanceOf(ConditionNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertLiteralContent("></div>", nodes[2]);
    });
});

interface SimpleTemplate {
    content: string,
    name: string,
    params: string
}