import { DirectiveNode } from '../../nodes/nodes';
import { StringUtilities } from '../../utilities/stringUtilities';
import { JsonFormatter, PhpFormatter } from '../transformer';
import { TransformOptions } from '../transformOptions';

export class DirectivePrinter {
    static printDirective(directive: DirectiveNode, options: TransformOptions, phpFormatter: PhpFormatter | null, jsonFormatter: JsonFormatter | null): string {
        let result = '@' + directive.directiveName.trim();

        if (directive.hasDirectiveParameters) {
            let paramContent = directive.directiveParameters;

            if (!directive.hasJsonParameters) {
                if (options.formatDirectivePhpParameters && phpFormatter != null && directive.hasValidPhp()) {
                    let params = directive.getPhpContent().trim();
                    if (params.startsWith('(') && params.endsWith(')')) {
                        params = params.substring(1);
                        params = params.substring(0, params.length - 1);
                    }

                    let tResult = phpFormatter('<?php ' + params);
                    tResult = StringUtilities.replaceAllInString(tResult, "\n", ' ');

                    if (directive.directiveName.toLowerCase() == 'forelse') {
                        tResult = tResult.substring(9);
                        tResult = tResult.substring(0, tResult.length - 14);
                    }

                    paramContent = '(' + tResult + ')';
                }
            } else {
                if (options.formatDirectiveJsonParameters && jsonFormatter && directive.hasValidJson()) {
                    let params = directive.getPhpContent().trim();
                    if (params.startsWith('(') && params.endsWith(')')) {
                        params = params.substring(1);
                        params = params.substring(0, params.length - 1);
                    }

                    const tResult = jsonFormatter(params);

                    paramContent = '(' + tResult + ')';
                }
            }

            result += ' '.repeat(options.spacesAfterDirective) + paramContent;
        }

        return result;
    }
}