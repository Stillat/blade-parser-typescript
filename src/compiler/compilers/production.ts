import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class ProductionCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php if(app()->environment(\'production\')): ?>';
    }
}