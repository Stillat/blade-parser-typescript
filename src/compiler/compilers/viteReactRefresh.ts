import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class ViteReactRefreshCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return `<?php echo app('Illuminate\\Foundation\\Vite')->reactRefresh(); ?>`;
    }
}