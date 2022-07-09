import assert = require('assert');
import { BladeDocument } from '../document/bladeDocument';
import { BladeComponentNode, ComponentNameNode, LiteralNode, ParameterNode } from '../nodes/nodes';
import { assertCount, assertInstanceOf, assertLiteralContent, assertNotNull, assertPosition } from './testUtils/assertions';

suite('Component Tags', () => {
    test('it can parse component tags', () => {
        const nodes = BladeDocument.fromText(`<x-slot name="foo">a
    Test
b</x-slot>`).getAllNodes();
        assertCount(3, nodes);
        assertInstanceOf(BladeComponentNode, nodes[0]);
        assertInstanceOf(LiteralNode, nodes[1]);
        assertInstanceOf(BladeComponentNode, nodes[2]);

        assertLiteralContent("a\n    Test\nb", nodes[1]);

        const componentOne = nodes[0] as BladeComponentNode,
            componentTwo = nodes[2] as BladeComponentNode;

        assert.strictEqual(componentOne.isClosingTag, false);
        assert.strictEqual(componentOne.isSelfClosing, false);
        assert.strictEqual(componentOne.sourceContent, "<x-slot name=\"foo\">");
        assert.strictEqual(componentTwo.isClosingTag, true);
        assert.strictEqual(componentTwo.isSelfClosing, false);
        assert.strictEqual(componentTwo.sourceContent, "</x-slot>");
    });

    test('it can parse self-closing tags', () => {
        const nodes = BladeDocument.fromText(`<x-slot name="foo" /><x-slot name="bar"/>`).getAllNodes();
        assertCount(2, nodes);
        assertInstanceOf(BladeComponentNode, nodes[0]);
        assertInstanceOf(BladeComponentNode, nodes[1]);

        const componentOne = nodes[0] as BladeComponentNode,
            componentTwo = nodes[1] as BladeComponentNode;

        assert.strictEqual(componentOne.isClosingTag, false);
        assert.strictEqual(componentOne.isSelfClosing, true);
        assert.strictEqual(componentOne.sourceContent, "<x-slot name=\"foo\" />");
        assert.strictEqual(componentTwo.isClosingTag, false);
        assert.strictEqual(componentTwo.isSelfClosing, true);
        assert.strictEqual(componentTwo.sourceContent, "<x-slot name=\"bar\"/>");
    });

    test('it can parse tag inner content', () => {
        const nodes = BladeDocument.fromText(`<x-slot name="foo" a/><x-slot name="bar" b>`).getAllNodes();
        assertCount(2, nodes);
        assertInstanceOf(BladeComponentNode, nodes[0]);
        assertInstanceOf(BladeComponentNode, nodes[1]);

        const componentOne = nodes[0] as BladeComponentNode,
            componentTwo = nodes[1] as BladeComponentNode;

        assert.strictEqual(componentOne.isClosingTag, false);
        assert.strictEqual(componentOne.isSelfClosing, true);
        assert.strictEqual(componentOne.sourceContent, "<x-slot name=\"foo\" a/>");
        assert.strictEqual(componentOne.innerContent, "slot name=\"foo\" a");

        assert.strictEqual(componentTwo.isClosingTag, false);
        assert.strictEqual(componentTwo.isSelfClosing, false);
        assert.strictEqual(componentTwo.innerContent, "slot name=\"bar\" b");
        assert.strictEqual(componentTwo.sourceContent, "<x-slot name=\"bar\" b>");
    });

    test('it can parse tag names', () => {
        const nodes = BladeDocument.fromText(`
     a<x-slot name="foo" a/>b
  c<x-slot name="bar" b>d`).getAllNodes();
        assertCount(5, nodes);

        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(BladeComponentNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertInstanceOf(BladeComponentNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);

        assertLiteralContent("\n     a", nodes[0]);
        assertLiteralContent("b\n  c", nodes[2]);
        assertLiteralContent("d", nodes[4]);

        const c1 = nodes[1] as BladeComponentNode,
            c2 = nodes[3] as BladeComponentNode;

        assert.strictEqual(c1.innerContent, "slot name=\"foo\" a");
        assert.strictEqual(c1.isClosingTag, false);
        assert.strictEqual(c1.isSelfClosing, true);
        assertNotNull(c1.name);

        const c1Name = c1.name as ComponentNameNode;

        assert.strictEqual(c1Name.name, 'slot');
        assertPosition(c1Name.startPosition, 2, 10);
        assertPosition(c1Name.endPosition, 2, 13);

        assert.strictEqual(c2.innerContent, "slot name=\"bar\" b");
        assert.strictEqual(c2.isClosingTag, false);
        assert.strictEqual(c2.isSelfClosing, false);
        assertNotNull(c2.name);

        const c2Name = c2.name as ComponentNameNode;

        assert.strictEqual(c2Name.name, 'slot');
        assertPosition(c2Name.startPosition, 3, 7);
        assertPosition(c2Name.endPosition, 3, 10);
    });

    test('it can parse parameter content', () => {
        const nodes = BladeDocument.fromText(`
     a<x-slot name="foo" a/>b
  c<x-slot name="bar" b>d`).getAllNodes();
        assertCount(5, nodes);

        assertInstanceOf(LiteralNode, nodes[0]);
        assertInstanceOf(BladeComponentNode, nodes[1]);
        assertInstanceOf(LiteralNode, nodes[2]);
        assertInstanceOf(BladeComponentNode, nodes[3]);
        assertInstanceOf(LiteralNode, nodes[4]);

        assertLiteralContent("\n     a", nodes[0]);
        assertLiteralContent("b\n  c", nodes[2]);
        assertLiteralContent("d", nodes[4]);

        const c1 = nodes[1] as BladeComponentNode,
            c2 = nodes[3] as BladeComponentNode;

        assert.strictEqual(c1.parameterContent, " name=\"foo\" a");
        assert.strictEqual(c2.parameterContent, " name=\"bar\" b");
    });

    test('it can parse parameters', () => {
        const nodes = BladeDocument.fromText(`<x-slot name="foo"
    name-two="bar" value_thing="that" ::this="that" param-with_chars='this'
    :another='one' hello="world"
/>`).getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(BladeComponentNode, nodes[0]);

        const component = nodes[0] as BladeComponentNode;

        assert.strictEqual(component.innerContent, "slot name=\"foo\"\n    name-two=\"bar\" value_thing=\"that\" ::this=\"that\" param-with_chars='this'\n    :another='one' hello=\"world\"\n");
        assert.strictEqual(component.parameterContent, " name=\"foo\"\n    name-two=\"bar\" value_thing=\"that\" ::this=\"that\" param-with_chars='this'\n    :another='one' hello=\"world\"\n");
        assert.strictEqual(component.sourceContent, "<x-slot name=\"foo\"\n    name-two=\"bar\" value_thing=\"that\" ::this=\"that\" param-with_chars='this'\n    :another='one' hello=\"world\"\n/>");

        assert.strictEqual(component.hasParameters, true);
        assertCount(7, component.parameters);

        assertParameterDetails(component.parameters[0], "name=\"foo\"", "name", "foo", "\"foo\"", "\"");
        assertParameterDetails(component.parameters[1], "name-two=\"bar\"", "name-two", "bar", "\"bar\"", "\"");
        assertParameterDetails(component.parameters[2], "value_thing=\"that\"", "value_thing", "that", "\"that\"", "\"");
        assertParameterDetails(component.parameters[3], "::this=\"that\"", "::this", "that", "\"that\"", "\"");
        assertParameterDetails(component.parameters[4], "param-with_chars='this'", "param-with_chars", "this", "'this'", "'");
        assertParameterDetails(component.parameters[5], ":another='one'", ":another", "one", "'one'", "'");
        assertParameterDetails(component.parameters[6], "hello=\"world\"", "hello", "world", "\"world\"", "\"");
    });

    test('it can detect variable expressions in parameters', () => {
        const nodes = BladeDocument.fromText(`<x-slot :another='one' ::hello="world" />`).getAllNodes();
        assertCount(1, nodes);
        assertInstanceOf(BladeComponentNode, nodes[0]);

        const component = nodes[0] as BladeComponentNode;
        assert.strictEqual(component.hasParameters, true);
        assertCount(2, component.parameters);

        const param1 = component.parameters[0],
            param2 = component.parameters[1];

        assert.strictEqual(param1.realName, 'another');
        assert.strictEqual(param1.isExpression, true);

        assert.strictEqual(param2.realName, 'hello');
        assert.strictEqual(param2.isExpression, false);
    });
});

function assertParameterDetails(parameter: ParameterNode, content: string, name: string, value: string, wrappedValue: string, terminator: string) {
    assert.strictEqual(parameter.content, content);
    assert.strictEqual(parameter.name, name);
    assert.strictEqual(parameter.value, value);
    assert.strictEqual(parameter.wrappedValue, wrappedValue);
    assert.strictEqual(parameter.terminatorStyle, terminator);
}