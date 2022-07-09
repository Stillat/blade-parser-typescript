import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndSwitchCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endswitch; ?>';
    }
}