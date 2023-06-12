import { BladeDocument } from '../document/bladeDocument';
import { IndentLevel } from '../document/printers/indentLevel';
import { TransformOptions } from '../document/transformOptions';
import { IExtractedAttribute } from '../parser/extractedAttribute';
import { formatAsJavaScript } from './prettier/utils';

export function formatExtractedScript(attribute: IExtractedAttribute, transformOptions: TransformOptions, slug: string, tmpContent: string): string {
    let addedVarPlaceholder = false;

    const formatContent = attribute.content.substring(1, attribute.content.length - 1).trim();

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
        const tmpDoc = BladeDocument.fromText('<script>' + tempTemplate + '</script>');

        // TODO: Return original if it contains structures.
        const tmpTransformer = tmpDoc.transform();

        const tmpResult = tmpTransformer.toStructure();

        toFormat = tmpResult.trim();
        toFormat = toFormat.substring(8);
        toFormat = toFormat.trim();
        toFormat = toFormat.substring(0, toFormat.length - 9);
        result = formatAsJavaScript(toFormat);

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
    } catch (err) {
        console.log(err);
        console.log(toFormat);
        // Prevent failures from crashing formatting process.
        debugger;
    }

    let targetIndent = IndentLevel.relativeIndentLevel(slug, tmpContent),
        transformedContent = result,
        appendFinal = ' '.repeat(targetIndent);

    const origTransformedContent = result.trim();
    if (origTransformedContent.startsWith('{') && origTransformedContent.endsWith('}')) {
        transformedContent = '"' + IndentLevel.shiftIndent(
            origTransformedContent,
            targetIndent,
            true,
            transformOptions,
            false,
            false
        ) + '"';
    } else {
        if (transformedContent.includes("\n") == false) {
            transformedContent = '"' + transformedContent.trim() + '"';
        } else {
            transformedContent = `"\n` + IndentLevel.shiftIndent(
                origTransformedContent,
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
