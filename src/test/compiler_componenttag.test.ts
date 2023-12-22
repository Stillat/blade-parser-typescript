import assert from 'assert';
import { AppClassNameResolver } from '../compiler/componentClassNameResolver.js';
import { ComponentDetailsResolver } from '../compiler/componentDetailsResolver.js';
import { PhpCompiler } from '../compiler/phpCompiler.js';
import { BladeDocument } from '../document/bladeDocument.js';

suite('Blade Component Tag Compiler', () => {
    test('slots can be compiled', () => {
        assert.strictEqual(
            compiler().compile(BladeDocument.fromText(`<x-slot name="foo">
</x-slot>`)),
            `@slot('foo', null, [])
@endslot`
        );
    });

    test('inline slots can be compiled', () => {
        assert.strictEqual(
            compiler().compile(BladeDocument.fromText(`<x-slot:foo>
</x-slot>`)),
            `@slot('foo', null, [])
@endslot`
        );
    });

    test('test dynamic slots can be compiled', () => {
        assert.strictEqual(
            compiler().compile(BladeDocument.fromText(`<x-slot :name="$foo">
</x-slot>`)),
            `@slot($foo, null, [])
@endslot`
        );
    });

    test('slots with attributes can be compiled', () => {
        assert.strictEqual(
            compiler().compile(BladeDocument.fromText(`<x-slot name="foo" class="font-bold">
</x-slot>`)),
            `@slot('foo', null, ['class' => 'font-bold'])
@endslot`
        );
    });

    test('inline slots with attributes can be compiled', () => {
        assert.strictEqual(
            compiler().compile(BladeDocument.fromText(`<x-slot:foo class="font-bold">
</x-slot>`)),
            `@slot('foo', null, ['class' => 'font-bold'])
@endslot`
        );
    });

    test('slots with dynamic attributes can be compiled', () => {
        assert.strictEqual(
            compiler().compile(BladeDocument.fromText(`<x-slot name="foo" :class="$classes">
</x-slot>`)),
            `@slot('foo', null, ['class' => \\Illuminate\\View\\Compilers\\BladeCompiler::sanitizeComponentAttribute($classes)])
@endslot`
        );
    });

    test('basic component parsing', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<div><x-alert type="foo" limit="5" @click="foo" wire:click="changePlan('{{ $plan }}')" required /><x-alert /></div>`)),
            `<div>##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'foo', 'limit' => '5', '@click' => 'foo', 'wire:click' => 'changePlan('.e($plan).')', 'required' => true]); ?>
@endComponentClass##END-COMPONENT-CLASS####BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
@endComponentClass##END-COMPONENT-CLASS##</div>`
        );
    });

    test('basic component with empty attributes parsing', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<div><x-alert type="" limit='' @click="" required /></div>`)),
            `<div>##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => '', 'limit' => '', '@click' => '', 'required' => true]); ?>
@endComponentClass##END-COMPONENT-CLASS##</div>`
        );
    });

    test('data camel casing', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['profile', 'TestProfileComponent::class']
            ])).compile(BladeDocument.fromText(`<x-profile user-id="1"></x-profile>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestProfileComponent', 'profile', ['userId' => '1'])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestProfileComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?> @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('colon data', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['profile', 'TestProfileComponent::class']
            ])).compile(BladeDocument.fromText(`<x-profile :user-id="1"></x-profile>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestProfileComponent', 'profile', ['userId' => 1])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestProfileComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?> @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('escaped colon attributed', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['profile', 'TestProfileComponent::class']
            ])).compile(BladeDocument.fromText(`<x-profile :user-id="1" ::title="user.name"></x-profile>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestProfileComponent', 'profile', ['userId' => 1])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestProfileComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([':title' => 'user.name']); ?> @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('colon attributes is escaped if strings', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['profile', 'TestProfileComponent::class']
            ])).compile(BladeDocument.fromText(`<x-profile :src="'foo'"></x-profile>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestProfileComponent', 'profile', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestProfileComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['src' => \\Illuminate\\View\\Compilers\\BladeCompiler::sanitizeComponentAttribute('foo')]); ?> @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('colon nested component parsing', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['foo:alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<x-foo:alert></x-foo:alert>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'foo:alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?> @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('colon starting nested component parsing', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['foo:alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<x:foo:alert></x-foo:alert>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'foo:alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?> @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('self closing components can be compiled', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<div><x-alert/></div>`)),
            `<div>##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
@endComponentClass##END-COMPONENT-CLASS##</div>`
        );
    });

    test('components can be compiled with hyphen attributes', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<x-alert class="bar" wire:model="foo" x-on:click="bar" @click="baz" />`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'bar', 'wire:model' => 'foo', 'x-on:click' => 'bar', '@click' => 'baz']); ?>
@endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('self closing components can be compoiled with data and attributes', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ]), {
                getDetails(componentName) {
                    return {
                        properties: ['title']
                    };
                },
            }).compile(BladeDocument.fromText(`<x-alert title="foo" class="bar" wire:model="foo" />`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', ['title' => 'foo'])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'bar', 'wire:model' => 'foo']); ?>
@endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('component can receive attribute bag', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['profile', 'TestProfileComponent::class']
            ])).compile(BladeDocument.fromText(`<x-profile class="bar" {{ $attributes }} wire:model="foo"></x-profile>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestProfileComponent', 'profile', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestProfileComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'bar', 'attributes' => \\Illuminate\\View\\Compilers\\BladeCompiler::sanitizeComponentAttribute($attributes), 'wire:model' => 'foo']); ?> @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('self closing component can receive attribute bag', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ]), {
                getDetails(componentName) {
                    return {
                        properties: ['title']
                    };
                },
            }).compile(BladeDocument.fromText(`<div><x-alert title="foo" class="bar" {{ $attributes->merge(['class' => 'test']) }} wire:model="foo" /></div>`)),
            `<div>##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', ['title' => 'foo'])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'bar', 'attributes' => \\Illuminate\\View\\Compilers\\BladeCompiler::sanitizeComponentAttribute($attributes->merge(['class' => 'test'])), 'wire:model' => 'foo']); ?>
@endComponentClass##END-COMPONENT-CLASS##</div>`
        );
    });

    test('components can have attached word', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['profile', 'TestProfileComponent::class']
            ])).compile(BladeDocument.fromText(`<x-profile></x-profile>Words`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestProfileComponent', 'profile', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestProfileComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?> @endComponentClass##END-COMPONENT-CLASS##Words`
        );
    });

    test('self closing components can have attached word', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['profile', 'TestProfileComponent::class']
            ])).compile(BladeDocument.fromText(`<x-profile/>Words`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestProfileComponent', 'profile', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestProfileComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
@endComponentClass##END-COMPONENT-CLASS##Words`
        );
    });

    test('self closing components can be compiled with bound data', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ]), {
                getDetails(componentName) {
                    return {
                        properties: ['title']
                    };
                },
            }).compile(BladeDocument.fromText(`<x-alert :title="$title" class="bar" />`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', ['title' => $title])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'bar']); ?>
@endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('paired component tags', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<x-alert>
</x-alert>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
 @endComponentClass##END-COMPONENT-CLASS##`
        );
    });

    test('attributes with > dont confuse it', () => {
        assert.strictEqual(
            compiler(new Map<string, string>([
                ['alert', 'TestAlertComponent::class']
            ])).compile(BladeDocument.fromText(`<x-alert class=">">
</x-alert>`)),
            `##BEGIN-COMPONENT-CLASS##@component('Illuminate\\Tests\\View\\Blade\\TestAlertComponent', 'alert', [])
<?php if (isset($attributes) && $constructor = (new ReflectionClass(Illuminate\\Tests\\View\\Blade\\TestAlertComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => '>']); ?>
 @endComponentClass##END-COMPONENT-CLASS##`
        );
    });
});

function compiler(aliases: Map<string, string> = new Map(), resolver: ComponentDetailsResolver | null = null) {
    const compiler = new PhpCompiler(),
        testResolver = new AppClassNameResolver();
    testResolver.setNamespace('Illuminate\\Tests\\View\\Blade\\');

    compiler.getComponentCompiler()
        .registerAliases(aliases)
        .setComponentNameResolver(testResolver).setComponentDetailsResolver(resolver);
    compiler.setCompileComponentTagBlade(false);

    return compiler;
}