import { Engine, If, Call, Node, Variable, PropertyLookup, Identifier, RetIf } from 'php-parser';
import { ILabeledRange } from '../nodes/labeledRange';
import { GenericLanguageStructures } from './genericLanguageStructures';

/**
 * This class helps find structures within PHP code
 * that should be ignored by class emulation. For
 * example, we cannot safely transform method
 * or function arguments as prettier will
 * remove whitespace from the classlist.
 * 
 * i.e., implode(', ') becomes implode(',')
 */
export class PhpStructuresAnalyzer {
    private parser: Engine;
    private structures: ILabeledRange[] = [];
    private hasStructuresWithUnknownLocations: boolean = false;
    private excludedStructures: string[] = [];

    constructor() {
        this.parser = new Engine({
            parser: {
                extractDoc: true,
            },
            ast: {
                withPositions: true,
                withSource: true,
            },
        });
    }

    hasUnknownLocations(): boolean {
        return this.hasStructuresWithUnknownLocations;
    }

    getStructureLocations(code: string, locationOffset: number): void {
        const ast = this.parser.parseCode(code, 'code.php');

        this.findStructureLocations(ast, locationOffset);
    }

    setExcludedStructures(structures: string[]) {
        this.excludedStructures = structures;
    }

    getStructures(): ILabeledRange[] {
        return this.structures;
    }

    private findStructureLocations(ast: Node, locationOffset: number): void {
        const ranges: ILabeledRange[] = [],
            excludedStructures = this.excludedStructures;
        let foundUnknownLocations = false;

        function traverse(node: any) {
            if (node.kind === 'if') {
                const ifStatement = node as If;

                if (ifStatement.test.loc == null) {
                    foundUnknownLocations = true;
                }

                if (excludedStructures.includes(GenericLanguageStructures.IfStatement)) {
                    ranges.push({
                        label: GenericLanguageStructures.IfStatement,
                        start: (ifStatement.test.loc?.start.offset ?? -1) - locationOffset,
                        end: (ifStatement.test.loc?.end.offset ?? -1) - locationOffset
                    });
                }
            } else if (node.kind == 'retif') {
                const retIf = node as RetIf;

                if (retIf.test.loc == null) {
                    foundUnknownLocations = true;
                }

                if (excludedStructures.includes(GenericLanguageStructures.TernaryStatement)) {
                    ranges.push({
                        label: GenericLanguageStructures.TernaryStatement,
                        start: (retIf.test.loc?.start.offset ?? -1) - locationOffset,
                        end: (retIf.test.loc?.end.offset ?? -1) - locationOffset + 2
                    });
                }
            } else if (node.kind == 'call') {
                const callStatement = node as Call;
                let addRange = true;

                if (callStatement.what.kind == 'propertylookup') {
                    const lookup = callStatement.what as unknown as PropertyLookup;

                    if (lookup.offset.kind == 'identifier') {
                        const identifier = lookup.offset as Identifier;

                        if (identifier.name == 'class') {
                            addRange = false;
                        }
                    }

                }

                if (!excludedStructures.includes(GenericLanguageStructures.CallStatement)) {
                    addRange = false;
                }

                if (addRange) {
                    if (callStatement.loc == null) {
                        foundUnknownLocations = true;
                    }

                    ranges.push({
                        label: GenericLanguageStructures.CallStatement,
                        start: (callStatement.loc?.start.offset ?? -1) - locationOffset,
                        end: (callStatement.loc?.end.offset ?? -1) - locationOffset
                    });
                }
            }

            for (const key in node) {
                if (node.hasOwnProperty(key) && typeof node[key] === 'object' && node[key]) {
                    traverse(node[key]);
                }
            }
        }

        traverse(ast);

        this.hasStructuresWithUnknownLocations = foundUnknownLocations;
        this.structures = ranges;
    }
}

function isObject(variable: any): boolean {
    return typeof variable === 'object' && variable !== null;
}