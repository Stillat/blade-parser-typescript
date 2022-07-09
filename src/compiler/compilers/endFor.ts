import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndForCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endfor; ?>';
    }

}