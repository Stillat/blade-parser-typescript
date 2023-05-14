import { PhpOperatorReflow } from '../../formatting/phpOperatorReflow';
import { DirectiveNode } from '../../nodes/nodes';
import { StringUtilities } from '../../utilities/stringUtilities';
import { JsonFormatter, PhpFormatter } from '../formatters';
import { TransformOptions } from '../transformOptions';

export class DirectivePrinter {
    private static defaultControlDirectiveNames:string[] = [
        'if', 'elseif', 'unless', 'foreach', 'for'
    ];

    static printDirective(directive: DirectiveNode, options: TransformOptions, phpFormatter: PhpFormatter | null, jsonFormatter: JsonFormatter | null): string {
        let directiveName = directive.directiveName.trim(),
            result = '@' + directiveName;

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

                    if (directive.directiveName.toLowerCase() == 'forelse') {
                        tResult = tResult.substring(9);
                        tResult = tResult.substring(0, tResult.length - 14);
                    }

                    if (PhpOperatorReflow.couldReflow(tResult)) {
                        tResult = PhpOperatorReflow.instance.reflow(tResult);
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

            let spacesToUse = options.spacesAfterDirective;

            if (DirectivePrinter.defaultControlDirectiveNames.includes(directiveName)) {
                spacesToUse = options.spacesAfterControlDirective;
            }

            result += ' '.repeat(spacesToUse) + paramContent;
        }

        return result;
    }
}