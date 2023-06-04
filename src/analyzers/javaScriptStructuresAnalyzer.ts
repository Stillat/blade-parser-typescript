import { BladeDocument } from '../document/bladeDocument';
import { ILabeledRange } from '../nodes/labeledRange';
import { GenericLanguageStructures } from './genericLanguageStructures';
const espree = require('espree');

export class JavaScriptStructuresAnalyzer {
    private document: BladeDocument;
    private structures: ILabeledRange[] = [];
    private excludedStructures: string[] = [];

    constructor(document: BladeDocument) {
        this.document = document;
    }

    getStructureLocations(): void {
        const fragments = this.document
            .getParser()
            .getFragmentsParser()
            .getEmbeddedDocumentStructures(),
            ranges: ILabeledRange[] = [],
            excludedStructures = this.excludedStructures;

        fragments.forEach((structure) => {
            const jsCode = this.document.getParser().getText((structure.start.endPosition?.offset ?? 0) + 1, structure.end?.startPosition?.offset ?? 0),
                startShift = (structure.start.endPosition?.offset ?? 0) + 1;
            const ast = espree.parse(jsCode, { range: true });

            function traverse(node: any) {
                if (node.type === 'CallExpression') {
                    const startIndex = node.start as number,
                        endIndex = node.end as number;

                    if (excludedStructures.includes(GenericLanguageStructures.CallStatement)) {
                        ranges.push({
                            label: GenericLanguageStructures.CallStatement,
                            start: startIndex + startShift,
                            end: endIndex + startShift
                        });
                    }
                } else if (node.type === 'IfStatement') {
                    const startIndex = node.start as number,
                        endIndex = node.end as number;

                    if (excludedStructures.includes(GenericLanguageStructures.IfStatement)) {
                        ranges.push({
                            label: GenericLanguageStructures.IfStatement,
                            start: startIndex + startShift,
                            end: endIndex + startShift
                        });
                    }
                }

                for (const key in node) {
                    if (node[key] && typeof node[key] === 'object') {
                        traverse(node[key]);
                    }
                }
            }

            traverse(ast);
        });

        this.structures = ranges;
    }

    getStructures(): ILabeledRange[] {
        return this.structures;
    }
}