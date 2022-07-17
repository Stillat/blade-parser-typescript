import * as prettier from 'prettier';
import { ErrorPrinter } from '../../document/printers/errorPrinter';
import { TransformOptions } from '../../document/transformOptions';
import { DocumentFormatter } from '../documentFormatter';
import { formatAsHtml, formatJson, formatPhp, formatTagPhp, setOptions } from './utils';

export class PrettierDocumentFormatter extends DocumentFormatter {
    constructor(options: prettier.ParserOptions, transformOptions: TransformOptions) {
        super();

        setOptions(options);

        this.withHtmlFormatter(formatAsHtml)
            .withPhpFormatter(formatPhp)
            .withBlockPhpFormatter(formatPhp)
            .withPhpTagFormatter(formatTagPhp)
            .withJsonFormatter(formatJson)
            .withTransformOptions(transformOptions)
            .withPreFormatter((document) => {
                if (document.errors.hasStructureErrors()) {
                    const error = document.errors.getFirstStructureError(),
                        lines = document.getLinesAround(error.node?.startPosition?.line ?? 1),
                        prettyError = ErrorPrinter.printError(error, lines);

                    throw new SyntaxError(prettyError);
                }

                return null;
            });
    }
}