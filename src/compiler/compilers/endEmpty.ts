import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndEmptyCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endif; ?>';
    }
}