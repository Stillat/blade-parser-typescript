import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class OverwriteCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->stopSection(true); ?>';
    }
}