import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ViteReactRefreshCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return `<?php echo app('Illuminate\\Foundation\\Vite')->reactRefresh(); ?>`;
    }
}