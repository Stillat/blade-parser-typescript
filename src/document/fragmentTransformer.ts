import { AbstractNode, BladeEchoNode, DirectiveNode, InlinePhpNode, LiteralNode } from '../nodes/nodes';
import { StringUtilities } from '../utilities/stringUtilities';

export class FragmentsTransformer {
    static transform(nodes: AbstractNode[], content: string) {
        let result = content;

        nodes.forEach((node) => {
            if (node instanceof BladeEchoNode) {
                result = result.replace(node.sourceContent, this.transformContent(node.sourceContent));
            } else if (node instanceof DirectiveNode && node.hasDirectiveParameters) {
                result = result.replace(node.sourceContent, this.transformContent(node.sourceContent));
            } else if (node instanceof InlinePhpNode) {
                result = result.replace(node.sourceContent, StringUtilities.replaceWithFillerExceptNewlines(node.sourceContent));
            }
        });

        return result;
    }

    private static transformContent(content: string): string {
        const replacedContent = content.replace(/>/g, 'B').replace(/</g, 'B');
        return replacedContent;
    }
}