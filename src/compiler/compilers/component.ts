import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { isStartOfString } from '../../parser/scanners/isStartOfString.js';
import { StringSplitter } from '../../parser/stringSplitter.js';
import { StringUtilities } from '../../utilities/stringUtilities.js';
import { NodeCompiler } from '../nodeCompiler.js';

import sha1 from 'sha1';

export class ComponentCompiler implements NodeCompiler {
    private hashStack: string[] = [];

    getClassHash() {
        if (this.hashStack.length == 0) {
            return '';
        }

        return this.hashStack[this.hashStack.length - 1];
    }

    pushHash(hash: string) {
        this.hashStack.push(hash);
    }

    popHash() {
        this.hashStack.pop();
    }

    static newComponentHash(component: string) {
        return sha1(component);
    }

    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            params = directive.getInnerContent(),
            parts = StringSplitter.fromText(params);

        if (parts.length > 0) {
            if (isStartOfString(parts[0].substr(0, 1))) {
                const stringValue = StringUtilities.unwrapString(parts[0]);

                if (stringValue.endsWith('::class')) {
                    const componentHash = sha1(stringValue),
                        componentName = parts[1].trim(),
                        componentArgs = parts[2].trim();

                    this.hashStack.push(componentHash);

                    return `<?php if (isset($component)) { $__componentOriginal${componentHash} = $component; } ?>
<?php $component = $__env->getContainer()->make(${stringValue}, ${componentArgs} + (isset($attributes) ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName(${componentName}); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>`;
                }
            }
        }

        return `<?php $__env->startComponent(${params}); ?>`;
    }
}