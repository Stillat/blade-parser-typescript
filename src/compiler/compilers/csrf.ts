import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class CsrfCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php echo csrf_field(); ?>';
    }
}