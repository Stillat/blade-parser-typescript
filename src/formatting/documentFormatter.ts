import { TransformOptions } from '../document/transformOptions';
import { PhpFormatter, BlockPhpFormatter, PhpTagFormatter, JsonFormatter, HtmlFormatter, PreFormatter } from '../document/formatters';
import { BladeDocument } from '../document/bladeDocument';
import { FormattingOptions } from './formattingOptions';

export class DocumentFormatter {
    private formattingOptions: FormattingOptions | null = null;
    private transformOptions: TransformOptions | null = null;
    private htmlFormatter: HtmlFormatter | null = null;
    private phpFormatter: PhpFormatter | null = null;
    private blockPhpFormatter: BlockPhpFormatter | null = null;
    private phpTagFormatter: PhpTagFormatter | null = null;
    private jsonFormatter: JsonFormatter | null = null;
    private preFormatter: PreFormatter | null = null;

    withTransformOptions(options: TransformOptions) {
        this.transformOptions = options;

        return this;
    }

    withFormattingOptions(options: FormattingOptions | null) {
        this.formattingOptions = options;

        return this;
    }

    withPreFormatter(formatter: PreFormatter) {
        this.preFormatter = formatter;

        return this;
    }

    withHtmlFormatter(formatter: HtmlFormatter) {
        this.htmlFormatter = formatter;

        return this;
    }

    withPhpFormatter(formatter: PhpFormatter) {
        this.phpFormatter = formatter;

        return this;
    }

    withBlockPhpFormatter(formatter: BlockPhpFormatter) {
        this.blockPhpFormatter = formatter;

        return this;
    }

    withPhpTagFormatter(formatter: PhpTagFormatter) {
        this.phpTagFormatter = formatter;

        return this;
    }

    withJsonFormatter(formatter: JsonFormatter) {
        this.jsonFormatter = formatter;

        return this;
    }

    formatText(text: string): string {
        return this.formatDocument(BladeDocument.fromText(text));
    }

    formatDocument(document: BladeDocument): string {
        if (this.preFormatter != null) {
            const preformatResult = this.preFormatter(document);

            if (preformatResult != null) {
                return preformatResult;
            }
        }

        if (this.htmlFormatter == null || document.isValid() == false) {
            return document.getOriginalContent();
        }

        document.transform()
            .withBlockPhpFormatter(this.blockPhpFormatter)
            .withPhpFormatter(this.phpFormatter)
            .withPhpTagFormatter(this.phpTagFormatter)
            .withJsonFormatter(this.jsonFormatter);

        if (this.transformOptions != null) {
            document.transform().withOptions(this.transformOptions);
        }

        const structure = document.transform().toStructure(),
            formatted = this.htmlFormatter(structure);

        return document.transform().fromStructure(formatted);
    }
}