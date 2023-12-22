import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { StringSplitter } from '../../parser/stringSplitter.js';
import { StringUtilities } from '../../utilities/stringUtilities.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class InjectCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            strings = StringSplitter.fromText(directive.getInnerContent()),
            variable = StringUtilities.unwrapString(strings[0]).trim(),
            service = strings[1].trim();

        return `<?php $${variable} = app(${service}); ?>`;
    }
}