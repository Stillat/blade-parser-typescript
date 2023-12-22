import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ProductionCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php if(app()->environment(\'production\')): ?>';
    }
}