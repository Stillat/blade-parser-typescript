import { BladeDocument } from '../document/bladeDocument';
import { BladeComponentNode, BladeEchoNode, LiteralNode, ParameterNode, ParameterType } from '../nodes/nodes';
import { AppClassNameResolver, ComponentClassNameResolver } from './componentClassNameResolver';
import { ComponentDetailsResolver } from './componentDetailsResolver';
const camelize = require('camelize');

export class ComponentTagCompiler {
    private aliases: Map<string, string> = new Map();
    private componentNameResolver: ComponentClassNameResolver;
    private compileBlade = false;
    private detailsResolver: ComponentDetailsResolver | null = null;

    constructor() {
        this.componentNameResolver = new AppClassNameResolver();
    }

    setComponentNameResolver(resolver: ComponentClassNameResolver) {
        this.componentNameResolver = resolver;

        return this;
    }

    setComponentDetailsResolver(resolver: ComponentDetailsResolver | null) {
        this.detailsResolver = resolver;

        return this;
    }

    registerAlias(componentName: string, className: string) {
        this.aliases.set(componentName, className);

        return this;
    }

    registerAliases(aliases: Map<string, string>) {
        this.aliases = aliases;

        return this;
    }

    private compileAttributes(parameters: ParameterNode[]): string {
        if (parameters.length == 0) {
            return '[]';
        }

        const attributeParts: string[] = [];
        let attributes = '[';

        parameters.forEach((param) => {
            if (param.isExpression) {
                attributeParts.push(`'${param.realName}' => \\Illuminate\\View\\Compilers\\BladeCompiler::sanitizeComponentAttribute(${param.value})`);
                return;
            }

            attributeParts.push(`'${param.realName}' => '${param.value}'`);
        });

        attributes += attributeParts.join(', ');
        attributes += ']';

        return attributes;
    }

    private compileSlot(component: BladeComponentNode): string {
        const nameParameter = component.getParameter('name');
        let slotName = component.name?.inlineName,
            attributes = this.compileAttributes(component.getParametersExcept(['name']));

        if (nameParameter != null) {
            slotName = nameParameter.value;

            if (nameParameter.isExpression) {
                return `@slot(${slotName}, null, ${attributes})`;
            }
        }

        return `@slot('${slotName}', null, ${attributes})`;
    }

    private componentDataAttributes(parameters: ParameterNode[], componentAttributes: string[]): string {
        if (parameters.length == 0) {
            return '[]';
        }

        const attributeParts: string[] = [];
        let attributes = '[';

        parameters.forEach((param) => {
            let paramName = param.realName;

            if (param.type == ParameterType.Attribute) {
                paramName = param.name;
            }

            if (!componentAttributes.includes(paramName)) {
                if (paramName.includes('-') == false) {
                    return;
                }

                if (paramName.includes(':')) {
                    return;
                }
            }

            paramName = camelize(paramName);

            if (param.type == ParameterType.Attribute) {
                attributeParts.push(`'${paramName}' => true`);
                return;
            }

            if (param.value.trim().includes('{{')) {
                const paramDoc = BladeDocument.fromText(param.value.trim());
                let newValue = '';

                paramDoc.getAllNodes().forEach((node) => {
                    if (node instanceof LiteralNode) {
                        newValue += node.content;
                    } else if (node instanceof BladeEchoNode) {
                        newValue += '.e(' + node.content.trim() + ').';
                    }
                });

                attributeParts.push(`'${paramName}' => '${newValue}'`);
                return;
            }

            if (param.isExpression) {
                attributeParts.push(`'${paramName}' => ${param.value}`);
                return;
            }

            attributeParts.push(`'${paramName}' => '${param.value}'`);
        });

        attributes += attributeParts.join(', ');
        attributes += ']';

        return attributes;
    }

    private componentClassAttributes(parameters: ParameterNode[], componentAttributes: string[]): string {
        if (parameters.length == 0) {
            return '[]';
        }

        const attributeParts: string[] = [];
        let attributes = '[';

        parameters.forEach((param) => {
            let paramName = param.realName;

            if (param.type == ParameterType.Attribute) {
                paramName = param.name;
            }

            if (componentAttributes.includes(paramName)) {
                return;
            }

            if (paramName.includes('-') && !paramName.includes(':')) {
                return;
            }

            if (param.isEscapedExpression) {
                paramName = ':' + paramName;
            }

            if (param.type == ParameterType.InlineEcho && param.inlineEcho != null) {
                const echoContent = param.inlineEcho.content.trim().toLowerCase();

                if (echoContent.startsWith('$attributes')) {
                    attributeParts.push(`'attributes' => \\Illuminate\\View\\Compilers\\BladeCompiler::sanitizeComponentAttribute(${param.inlineEcho.content.trim()})`);
                    return;
                }
            }

            if (param.type == ParameterType.Attribute) {
                attributeParts.push(`'${paramName}' => true`);
                return;
            }

            if (param.value.trim().includes('{{')) {
                const paramDoc = BladeDocument.fromText(param.value.trim());
                let newValue = '';

                paramDoc.getAllNodes().forEach((node) => {
                    if (node instanceof LiteralNode) {
                        newValue += node.content;
                    } else if (node instanceof BladeEchoNode) {
                        newValue += '.e(' + node.content.trim() + ').';
                    }
                });

                attributeParts.push(`'${paramName}' => '${newValue}'`);
                return;
            }

            if (param.isExpression) {
                attributeParts.push(`'${paramName}' => \\Illuminate\\View\\Compilers\\BladeCompiler::sanitizeComponentAttribute(${param.value})`);
                return;
            }

            attributeParts.push(`'${paramName}' => '${param.value}'`);
        });

        attributes += attributeParts.join(', ');
        attributes += ']';

        return attributes;
    }

    compile(component: BladeComponentNode): string {
        if (component.name?.name == 'slot') {
            if (component.isClosingTag) {
                return '@endslot';
            } else {
                return this.compileSlot(component);
            }
        }

        if (component.isClosingTag && !component.isSelfClosing) {
            return ` @endComponentClass##END-COMPONENT-CLASS##`;
        }

        let componentName = component.name?.name as string,
            alias = componentName;

        if (component.name != null && component.name.inlineName.length > 0) {
            componentName = componentName + ':' + component.name?.inlineName;
            alias = componentName;
        }

        if (this.aliases.has(componentName)) {
            componentName = this.aliases.get(componentName) as string;
        }

        let propertyNames: string[] = [];

        if (this.detailsResolver != null) {
            const componentDetails = this.detailsResolver.getDetails(alias);

            if (componentDetails != null) {
                propertyNames = componentDetails.properties;
            }
        }

        const componentClass = this.componentNameResolver.resolveName(componentName),
            attributes = this.componentClassAttributes(component.parameters, propertyNames),
            dataAttributes = this.componentDataAttributes(component.parameters, propertyNames);

        let componentTag = `##BEGIN-COMPONENT-CLASS##@component('${componentClass}', '${alias}', ${dataAttributes})
<?php if (isset($attributes) && $constructor = (new ReflectionClass(${componentClass}::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(${attributes}); ?>`;

        if (component.isSelfClosing) {
            componentTag += `
@endComponentClass##END-COMPONENT-CLASS##`;
        }

        return componentTag;
    }
}