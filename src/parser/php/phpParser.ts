import { Engine } from 'php-parser';
import { DocumentPadder } from '../../document/documentPadder';
import { DirectiveNode } from '../../nodes/nodes';

export class PhpParser {
    private directive: DirectiveNode;

    constructor(directive: DirectiveNode) {
        this.directive = directive;
    }

    parse() {
        const parser = new Engine({
            parser: {
                extractDoc: true,
            },
            ast: {
                withPositions: true,
                withSource: true,
            },
        });

        const paddedContent = DocumentPadder.pad(
            this.directive.directiveParameters,
            this.directive.directiveParametersPosition?.start?.line ?? 0,
            this.directive.directiveParametersPosition?.start?.char ?? 0,
        );

        return parser.parseEval(paddedContent);
    }
}