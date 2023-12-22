import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class CanAnyCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php if (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->any(' + directive.getInnerContent() + ')): ?>';
    }
}