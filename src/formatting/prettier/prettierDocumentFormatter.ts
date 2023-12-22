import * as prettier from 'prettier';
import { ErrorPrinter } from '../../document/printers/errorPrinter.js';
import { TransformOptions } from '../../document/transformOptions.js';
import { DocumentFormatter } from '../documentFormatter.js';
import { formatAsHtml, formatJson, formatPhp, formatTagPhp, inlineFormatPhp, setOptions } from './utils.js';

export class PrettierDocumentFormatter extends DocumentFormatter {
    constructor(options: prettier.ParserOptions, transformOptions: TransformOptions) {
        super();

        setOptions(options);
        
        this.withHtmlFormatter(formatAsHtml)
            .withFilePath(options.filepath)
            .withPhpFormatter(inlineFormatPhp)
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