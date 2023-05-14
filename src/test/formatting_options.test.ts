import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';
import { defaultSettings } from '../formatting/optionDiscovery';

suite('Formatting Options', () => {
    test('formatting inside echos can be disabled', () => {
        const template = `{{ ! $foo }}`;

        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatInsideEcho: false
        }).trim(), template);
    });

    test('formatting of directive args can be disabled', () => {
        const template = `@class([
    'foo' => true
])`;
        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatDirectivePhpParameters: false,
        }).trim(), template);
    });

    test('formatting props args can be disabled', () => {
        let template = `@props([
    'foo' => [],
])`;
        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatDirectivePhpParameters: false,
        }).trim(), template);

        template = `@props([
    'some' => null,
    'property' => null,
])`;
        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatDirectivePhpParameters: false,
        }).trim(), template);
    });
});