import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class CannotCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php if (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->denies(' + directive.getInnerContent() + ')): ?>';
    }
}