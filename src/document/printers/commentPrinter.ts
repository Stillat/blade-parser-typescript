import { BladeCommentNode } from '../../nodes/nodes';
import { StringUtilities } from '../../utilities/stringUtilities';

export class CommentPrinter {
    static printComment(comment: BladeCommentNode, tabSize: number, targetIndent: number): string {
        if (comment.isMultiline()) {
            const lines = StringUtilities.breakByNewLine(comment.innerContent.trim()),
                reflowedLines: string[] = [];

            lines.forEach((line) => {
                reflowedLines.push(' '.repeat(tabSize + targetIndent) + line.trim());
            });

            const content = reflowedLines.join("\n");
            let newComment = "{{--\n";
            newComment += content;
            newComment += "\n" + ' '.repeat(targetIndent) + '--}}';

            return newComment;
        }

        return '{{-- ' + comment.innerContent.trim() + ' --}}';
    }
}