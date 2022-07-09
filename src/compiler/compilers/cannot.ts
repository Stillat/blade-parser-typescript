import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class CannotCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php if (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->denies(' + directive.getInnerContent() + ')): ?>';
    }
}