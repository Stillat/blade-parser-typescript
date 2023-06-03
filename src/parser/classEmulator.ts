import { PhpStructuresAnalyzer } from '../analyzers/phpStructuresAnalyzer';
import { formatAsHtmlStrings } from '../formatting/prettier/utils';
import { ILabeledRange } from '../nodes/labeledRange';
import { StringUtilities } from '../utilities/stringUtilities';
import { InlineStringParser } from './inlineStringParser';
import { StringRemover } from './stringRemover';

export class ClassEmulator {
    private phpStructuresAnalyzer: PhpStructuresAnalyzer;
    private stringParser: InlineStringParser;
    private mergeRanges: ILabeledRange[] = [];

    constructor() {
        this.phpStructuresAnalyzer = new PhpStructuresAnalyzer();
        this.stringParser = new InlineStringParser();
    }

    withAdditionalRanges(mergeRanges: ILabeledRange[]) {
        this.mergeRanges = this.mergeRanges.concat(mergeRanges);
    }

    emulateString(content: string): string {
        const uniqueSlug = StringUtilities.makeSlug(32),
            prefix = `Emulate:${uniqueSlug}=`;

        this.stringParser.setIgnoreRanges(this.phpStructuresAnalyzer.getStructures().concat(this.mergeRanges));
        this.stringParser.parse(content);

        if (!this.stringParser.hasStringNodes()) {
            return content;
        }

        const stringNodes = this.stringParser.getParsedNodes(),
            stringStartMapping: Map<number, string> = new Map(),
            stringTransformMapping: Map<number, string> = new Map();

        let emulateDocument: string = '';

        stringNodes.forEach((node) => {
            if (node.type == 'string') {
                stringStartMapping.set(node.index, node.content[0]);
                emulateDocument += `<!-- "${prefix}${node.index}"-->\n`;
                emulateDocument += `<div class="${node.content.substring(1, node.content.length - 1)}"></div>\n`;
            }
        });

        console.log(emulateDocument);
        debugger;

        emulateDocument = formatAsHtmlStrings(emulateDocument);

        // Now that we have formatted our emulated document,
        // we need to get the newly transformed strings.
        // To do this, we can simply use the string
        // remover utility and populate our map.
        const remover = new StringRemover();

        remover.remove(emulateDocument);

        const extracted = remover.getStrings();

        for (let i = 0; i < extracted.length; i++) {
            let line = extracted[i];

            if (line.startsWith(prefix)) {
                line = line.substring(prefix.length).trim();
                const originalNodeIndex = parseInt(line);

                if (i + 1 < extracted.length) {
                    const transformed = extracted[i + 1];


                    stringTransformMapping.set(originalNodeIndex, transformed);
                    i++;
                }
            }
        }

        // Now we can rebuild the document!
        let newDocument = '';

        stringNodes.forEach((node) => {
            if (node.type == 'literal' || !stringTransformMapping.has(node.index)) {
                newDocument += node.content;

                return;
            }

            const originalStringStart = stringStartMapping.get(node.index) as string,
                transformedResult = stringTransformMapping.get(node.index) as string;

            newDocument += originalStringStart + transformedResult + originalStringStart;
        });

        return newDocument;
    }

    emulatePhpNode(content: string) {
        const analyzeContent = '<?php ' + content;
        this.phpStructuresAnalyzer.getStructureLocations(analyzeContent, 0);

        return this.emulateString(analyzeContent).trimLeft().substring(6);
    }

    emulatePhpTag(content: string): string {
        this.phpStructuresAnalyzer.getStructureLocations(content, 0);

        return this.emulateString(content);
    }
}