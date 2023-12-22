import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndForEachCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>';
    }
}