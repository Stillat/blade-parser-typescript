import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { StringSplitter } from '../../parser/stringSplitter';
import { NodeCompiler } from '../nodeCompiler';

export class JsonCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            params = StringSplitter.fromText(directive.getInnerContent()),
            variable = params[0].trim();

        if (params.length == 1) {
            return '<?php echo json_encode(' + variable + ', 15, 512) ?>';
        }

        const encoding = params[1].trim();

        return '<?php echo json_encode(' + variable + ', ' + encoding + ', 512) ?>';
    }
}