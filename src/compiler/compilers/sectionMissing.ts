import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class SectionMissingCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            params = directive.getInnerContent();

        return `<?php if (empty(trim($__env->yieldContent(${params})))): ?>`;
    }
}