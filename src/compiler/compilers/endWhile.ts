import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndWhileCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endwhile; ?>';
    }
}