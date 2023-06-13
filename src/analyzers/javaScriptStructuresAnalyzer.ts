import { parseScript } from 'esprima';
import { ILabeledRange } from '../nodes/labeledRange';
import { GenericLanguageStructures } from './genericLanguageStructures';

export class JavaScriptStructuresAnalyzer {
    private structures: ILabeledRange[] = [];
    private hasStructuresWithUnknownLocations: boolean = false;
    private excludedStructures: string[] = [];
    private allowedMethods: string[] = [];

    constructor() { }

    hasUnknownLocations(): boolean {
        return this.hasStructuresWithUnknownLocations;
    }

    getStructureLocations(code: string, locationOffset: number): void {
        try {
            const ast = parseScript(code, { loc: true });

            this.findStructureLocations(ast, code, locationOffset);
        } catch (error) {
            
        }
    }

    setExcludedStructures(structures: string[]) {
        this.excludedStructures = structures;
    }

    setAllowedMethods(methods: string[]) {
        this.allowedMethods = methods;
    }

    getStructures(): ILabeledRange[] {
        return this.structures;
    }

    private findStructureLocations(ast: any, code: string, locationOffset: number): void {
        const ranges: ILabeledRange[] = [],
            excludedStructures = this.excludedStructures,
            allowedMethodNames = this.allowedMethods;
        let foundUnknownLocations = false;

        function getOffsetFromLineColumn(line: number, column: number): number {
            const lines = code.split('\n');
            let offset = 0;

            for (let i = 0; i < line - 1; i++) {
                offset += lines[i].length + 1; // +1 to account for the newline character
            }

            offset += column - 1;

            return offset;
        }

        function traverse(node: any) {
            if (node.loc) {
                const startOffset = getOffsetFromLineColumn(node.loc.start.line, node.loc.start.column) - locationOffset;
                const endOffset = getOffsetFromLineColumn(node.loc.end.line, node.loc.end.column) - locationOffset;

                if (node.type === 'IfStatement') {
                    if (node.test.loc == null) {
                        foundUnknownLocations = true;
                    }

                    if (excludedStructures.includes(GenericLanguageStructures.IfStatement)) {
                        ranges.push({
                            label: GenericLanguageStructures.IfStatement,
                            start: startOffset,
                            end: endOffset,
                        });
                    }
                } else if (node.type === 'ConditionalExpression') {
                    if (node.test.loc == null) {
                        foundUnknownLocations = true;
                    }

                    if (excludedStructures.includes(GenericLanguageStructures.TernaryStatement)) {
                        ranges.push({
                            label: GenericLanguageStructures.TernaryStatement,
                            start: startOffset,
                            end: endOffset,
                        });
                    }
                } else if (node.type === 'AssignmentExpression') {
                    let addRange = true;

                    if (node.left.loc == null || node.right.loc == null) {
                        foundUnknownLocations = true;
                    }

                    if (!excludedStructures.includes(GenericLanguageStructures.Assignment)) {
                        addRange = false;
                    }

                    if (addRange) {
                        ranges.push({
                            label: GenericLanguageStructures.Assignment,
                            start: startOffset,
                            end: endOffset,
                        });
                    }
                } else if (node.type === 'BinaryExpression') {
                    let addRange = true;

                    if (node.left.loc == null || node.right.loc == null) {
                        foundUnknownLocations = true;
                    }

                    if (!excludedStructures.includes(GenericLanguageStructures.BinCompare)) {
                        addRange = false;
                    }

                    if (addRange) {
                        ranges.push({
                            label: GenericLanguageStructures.BinCompare,
                            start: startOffset,
                            end: endOffset,
                        });
                    }
                } else if (node.type === 'CallExpression') {
                    let addRange = true;

                    if (node.callee.type === 'MemberExpression') {
                        const memberExpr = node.callee;

                        if (memberExpr.property.type === 'Identifier') {
                            const identifier = memberExpr.property;

                            if (allowedMethodNames.includes(identifier.name)) {
                                addRange = false;
                            }
                        }
                    }

                    if (!excludedStructures.includes(GenericLanguageStructures.CallStatement)) {
                        addRange = false;
                    }

                    if (addRange) {
                        if (node.loc == null) {
                            foundUnknownLocations = true;
                        }

                        ranges.push({
                            label: GenericLanguageStructures.CallStatement,
                            start: startOffset,
                            end: endOffset,
                        });
                    }
                }
            }

            for (const key in node) {
                if (isObject(node[key])) {
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
