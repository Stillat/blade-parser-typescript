import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class JsCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php echo \\Illuminate\\Support\\Js::from(' + directive.getInnerContent() + ')->toHtml() ?>';
    }
}