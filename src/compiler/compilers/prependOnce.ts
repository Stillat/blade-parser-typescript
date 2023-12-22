import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { StringSplitter } from '../../parser/stringSplitter.js';
import { DirectiveIdResolver } from '../directiveIdResolver.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class PrependOnceCompiler implements NodeCompiler {
    private idResolver: DirectiveIdResolver;

    constructor(idResolver: DirectiveIdResolver) {
        this.idResolver = idResolver;
    }

    setIdResolver(idResolver: DirectiveIdResolver) {
        this.idResolver = idResolver;
    }

    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            params = StringSplitter.fromText(directive.getInnerContent());

        let viewName = params[0].trim(),
            id = '';

        if (params.length == 1) {
            id = "'" + this.idResolver.id(directive) + "'";
        } else if (params.length == 2) {
            id = params[1].trim();
        }

        return `<?php if (! $__env->hasRenderedOnce(${id})): $__env->markAsRenderedOnce(${id});
$__env->startPrepend(${viewName}); ?>`;
    }
}