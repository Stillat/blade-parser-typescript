import { TransformOptions } from '../document/transformOptions.js';
import { PhpFormatter, BlockPhpFormatter, PhpTagFormatter, JsonFormatter, HtmlFormatter, PreFormatter } from '../document/formatters.js';
import { BladeDocument } from '../document/bladeDocument.js';
import { FormattingOptions } from './formattingOptions.js';
import { IExtractedAttribute } from '../parser/extractedAttribute.js';

export class DocumentFormatter {
    private filePath: string = '';
    private formattingOptions: FormattingOptions | null = null;
    private transformOptions: TransformOptions | null = null;
    private htmlFormatter: HtmlFormatter | null = null;
    private phpFormatter: PhpFormatter | null = null;
    private blockPhpFormatter: BlockPhpFormatter | null = null;
    private phpTagFormatter: PhpTagFormatter | null = null;
    private jsonFormatter: JsonFormatter | null = null;
    private preFormatter: PreFormatter | null = null;
    private removedAttributes: Map<string, IExtractedAttribute> = new Map();

    withRemovedAttributes(attributes: Map<string, IExtractedAttribute>) {
        this.removedAttributes = attributes;

        return this;
    }

    withTransformOptions(options: TransformOptions) {
        this.transformOptions = options;

        return this;
    }

    withFilePath(filePath: string) {
        this.filePath = filePath;

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

    async formatText(text: string): Promise<string> {
        return await this.formatDocument(BladeDocument.fromText(text));
    }

    async formatDocument(document: BladeDocument, shadowDocument: BladeDocument | null = null): Promise<string> {
        if (this.preFormatter != null) {
            const preformatResult = await this.preFormatter(document);

            if (preformatResult != null) {
                return preformatResult;
            }
        }

        if (this.htmlFormatter == null || document.isValid() == false) {
            return document.getOriginalContent();
        }

        document.transform()
            .withShadowDocument(shadowDocument)
            .withFilePath(this.filePath)
            .withBlockPhpFormatter(this.blockPhpFormatter)
            .withPhpFormatter(this.phpFormatter)
            .withPhpTagFormatter(this.phpTagFormatter)
            .withJsonFormatter(this.jsonFormatter)
            .withRemovedAttributes(this.removedAttributes);

        document.transform().setFormattingOptions(this.formattingOptions);
        if (this.transformOptions != null) {
            document.transform().withOptions(this.transformOptions);
        }

        const structure = document.transform().toStructure();
        const formatted = await this.htmlFormatter(structure);

        return document.transform().fromStructure(formatted);
    }
}