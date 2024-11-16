import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class FeatureAnyCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php if(Laravel\\Pennant\\Feature::someAreActive(' + directive.getInnerContent() + ')): ?>'
    }
}
