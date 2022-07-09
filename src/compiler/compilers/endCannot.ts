import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndCannotCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endif; ?>';
    }
}