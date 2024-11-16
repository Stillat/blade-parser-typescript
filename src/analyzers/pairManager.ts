import { AbstractNode, DirectiveNode } from '../nodes/nodes.js';

export class PairManager {
    private static possibleClosingNode: Map<string, number> = new Map();

    // A list of all Blade directives that act like a beginning if statement.
    public static alwaysRewrite: string[] = [
        'unless',
        'sectionMissing',
        'hasSection',
        'can',
        'auth',
        'env',
        'isset',
        'guest',
        'cannot',
        'canany',
        'hasSection',
        'production',
        'feature',
        'featureany',
    ];

    public static customIfs: Map<string, number> = new Map();

    private static speculativeConditions: Map<string, number> = new Map();
    private static speculativeEndIfs: Map<string, number> = new Map();

    static clearSpeculativeConditions() {
        this.speculativeConditions.clear();
    }

    static clearSpeculativeEndIfs() {
        this.speculativeEndIfs.clear();
    }

    static getSpeculativeConditions() {
        return this.speculativeConditions;
    }

    static getSpeculativeEndIfs() {
        return this.speculativeEndIfs;
    }

    static isSpeculativeCondition(name: string): boolean {
        return this.speculativeConditions.has(name);
    }

    static isSpeculativeEndIf(name: string): boolean {
        return this.speculativeEndIfs.has(name);
    }

    static registerSpeculativeCondition(name: string) {
        this.speculativeConditions.set(name, 1);
    }

    static registerSpeculativeEndIf(name: string) {
        this.speculativeEndIfs.set(name, 1);
    }

    static canClose(directive: DirectiveNode): boolean {
        const checkName = 'end' + directive.directiveName.toLowerCase();

        return this.possibleClosingNode.has(checkName);
    }

    static shouldRewrite(node: DirectiveNode): boolean {
        if (this.customIfs.has(node.name)) {
            return true;
        }

        if (this.alwaysRewrite.includes(node.name)) {
            return true;
        }

        if (this.speculativeEndIfs.has(node.directiveName)) {
            return true;
        }

        if (this.speculativeConditions.has(node.name)) {
            return true;
        }

        return false;
    }

    static determineCandidates(nodes: AbstractNode[]) {
        const allNonClosingCandidates: Map<string, number> = new Map();


        nodes.forEach((node) => {
            if ((node instanceof DirectiveNode) == false) { return; }
            const directive = node as DirectiveNode;

            if (!directive.directiveName.toLowerCase().startsWith('end')) {
                allNonClosingCandidates.set(directive.directiveName.toLowerCase(), 1);
            }
        });

        nodes.forEach((node) => {
            if ((node instanceof DirectiveNode) == false) { return; }
            const directive = node as DirectiveNode;

            if (directive.directiveName.toLowerCase().startsWith('unless')) {
                const checkName = directive.directiveName.substring(6);

                if (checkName.length > 0) {
                    this.speculativeConditions.set(directive.directiveName, 1);
                    this.speculativeEndIfs.set('end' + checkName, 1);
                }
            }

            if (this.speculativeEndIfs.has(directive.directiveName)) {
                directive.isClosingDirective = true;
            }

            if (directive.directiveName.toLowerCase().startsWith('else')) {
                const checkName = directive.directiveName.substring(4);

                if (checkName != 'if' && checkName.length > 0) {
                    this.speculativeConditions.set(checkName, 1);
                }
            }

            if (directive.directiveName.toLowerCase().startsWith('end')) {
                const checkName = directive.directiveName.substring(3).toLowerCase();

                if (allNonClosingCandidates.has(checkName)) {
                    this.possibleClosingNode.set(directive.directiveName.toLowerCase(), 1);
                    directive.isClosingDirective = true;
                }
            }
        });
    }
}