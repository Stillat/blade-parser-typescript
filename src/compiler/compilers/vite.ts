import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ViteCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            params = directive.getInnerContent();

        if (params.trim().length == 0) {
            return `<?php echo app('Illuminate\\Foundation\\Vite')(); ?>`;
        }

        return `<?php echo app('Illuminate\\Foundation\\Vite')(${params}); ?>`;
    }
}