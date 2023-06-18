import { BladeDocument } from '../document/bladeDocument';
import { IndentLevel } from '../document/printers/indentLevel';
import { TransformOptions } from '../document/transformOptions';
import { Transformer } from '../document/transformer';
import { IExtractedAttribute } from '../parser/extractedAttribute';
import { GeneralSyntaxReflow } from './generalSyntaxReflow';
import { formatAsJavaScript } from './prettier/utils';

const safetyChars = [
    '(', ')', '{', '}', , ':', '->', '<', '>'
];

export function formatExtractedScript(attribute: IExtractedAttribute,
    transformOptions: TransformOptions,
    slug: string,
    tmpContent: string,
    parentTransformer: Transformer,
    originalDoc: BladeDocument): string {
    let addedVarPlaceholder = false;

    const formatContent = attribute.content.substring(1, attribute.content.length - 1).trim();
    
    let shouldContinue = false;

    for (let i = 0; i < safetyChars.length; i++) {
        if (formatContent.includes(safetyChars[i] as string)) {
            shouldContinue = true;
            break;
        }
    }

    if (!shouldContinue) {
        return attribute.content;
    }


    let tempTemplate = "\n";

    if (formatContent.startsWith('{') && formatContent.endsWith('}')) {
        tempTemplate += 'let _tmpFormat = ';
        addedVarPlaceholder = true;
    }

    tempTemplate += formatContent;

    tempTemplate += "\n";

    let result = attribute.content;
    let toFormat = '';
    try {
        const tmpDoc = new BladeDocument();

        tmpDoc.getParser().withParserOptions(originalDoc.getParser().getParserOptions());
        tmpDoc.getParser().withPhpValidator(originalDoc.getParser().getPhpValidator());

        tmpDoc.loadString('<script>' + tempTemplate + '</script>');

        tmpDoc.getParser()

        // TODO: Return original if it contains structures.
        const tmpTransformer = tmpDoc.transform();

        tmpTransformer.setParentTransformer(parentTransformer);
        tmpTransformer.withOptions(transformOptions);
        tmpTransformer.setFormattingOptions(parentTransformer.getFormattingOptions());
        tmpTransformer.withJsonFormatter(parentTransformer.getJsonFormatter());
        tmpTransformer.withBlockPhpFormatter(parentTransformer.getBlockPhpFormatter());
        tmpTransformer.withPhpTagFormatter(parentTransformer.getPhpTagFormatter());
        tmpTransformer.withPhpFormatter(parentTransformer.getPhpFormatter());

        const tmpResult = tmpTransformer.toStructure();

        toFormat = tmpResult.trim();
        toFormat = toFormat.substring(8);
        toFormat = toFormat.trim();
        toFormat = toFormat.substring(0, toFormat.length - 9);

        result = formatAsJavaScript(toFormat, transformOptions);

        result = tmpTransformer.fromStructure(result);
        if (addedVarPlaceholder) {
            result = result.trimLeft();
            result = result.substring(3);
            result = result.trimLeft();
            result = result.substring(10);
            result = result.trimLeft();
            result = result.substring(1);
            result = result.trimLeft();
        }

        result = result.trim();

        if (formatContent.trim().endsWith(';') == false && result.endsWith(';')) {
            result = result.substring(0, result.length - 1);
        }

        result = parentTransformer.transformStructures(result);
    } catch (err) {
        return attribute.content;
    }

    let targetIndent = IndentLevel.relativeIndentLevel(slug, tmpContent),
        transformedContent = result,
        appendFinal = ' '.repeat(targetIndent);

    const origTransformedContent = result.trim();
    if (origTransformedContent.startsWith('{') && origTransformedContent.endsWith('}')) {
        transformedContent = '"' + IndentLevel.shiftIndent(
            GeneralSyntaxReflow.instance.safeReflow(origTransformedContent),
            targetIndent,
            true,
            transformOptions,
            false,
            false
        ) + '"';
    } else {
        if (transformedContent.includes("\n") == false) {
            transformedContent = '"' + GeneralSyntaxReflow.instance.safeReflow(transformedContent.trim()) + '"';
        } else {
            transformedContent = `"\n` + IndentLevel.shiftIndent(
                GeneralSyntaxReflow.instance.safeReflow(origTransformedContent),
                targetIndent + transformOptions.tabSize,
                false,
                transformOptions,
                false,
                false
            ) + `\n${appendFinal}"`;
        }
    }

    return transformedContent;
}
