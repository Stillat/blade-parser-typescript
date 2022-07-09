import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class ElseCanCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php elseif (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->check(' + directive.getInnerContent() + ')): ?>';
    }
}