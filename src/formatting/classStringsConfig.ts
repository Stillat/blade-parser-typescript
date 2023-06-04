import { GenericLanguageStructures } from '../analyzers/genericLanguageStructures';
import { BladeDocument } from '../document/bladeDocument';
import { BladeEchoNode, DirectiveNode, InlinePhpNode } from '../nodes/nodes';

export interface IClassRuleset {
    includeWhen: string[],
    excludeWhen: string[]
}

export interface IClassStringConfiguration {
    enabled: boolean,

    directivesEnabled: boolean,
    excludedDirectives: string[],
    directives: IClassRuleset[],

    allowedMethodNames: string[],

    bladePhpEnabled: boolean,
    phpTagsEnabled: boolean,
    phpTagRules: IClassRuleset[],

    ignoredLanguageStructures: string[],

    bladeEchoEnabled: boolean,
    bladeEchoRules: IClassRuleset[],

    documentRules: IClassRuleset,
    stringRules: IClassRuleset,
}

export function getDefaultClassStringConfig(): IClassStringConfiguration {
    return {
        enabled: true,
        directivesEnabled: true,
        excludedDirectives: [
            'if', 'unless', 'elseif', 'for', 'forelse', 'foreach',
        ],
        allowedMethodNames: ['class'],
        directives: [],
        bladePhpEnabled: true,
        phpTagsEnabled: true,
        phpTagRules: [],

        ignoredLanguageStructures: [
            GenericLanguageStructures.CallStatement,
            GenericLanguageStructures.IfStatement,
            GenericLanguageStructures.TernaryStatement,
            GenericLanguageStructures.BinCompare,
            GenericLanguageStructures.Addition,
            GenericLanguageStructures.Substraction,
            GenericLanguageStructures.Multiplication,
            GenericLanguageStructures.Division,
            GenericLanguageStructures.Modulus,
            GenericLanguageStructures.Exponentiation,
            GenericLanguageStructures.Concat,
            GenericLanguageStructures.GreaterThan,
            GenericLanguageStructures.GreaterThanEqual,
            GenericLanguageStructures.LessThan,
            GenericLanguageStructures.LessThanEqual,
            GenericLanguageStructures.BitwiseAnd,
            GenericLanguageStructures.BitwiseOr,
            GenericLanguageStructures.BitwiseXor,
            GenericLanguageStructures.LeftShift,
            GenericLanguageStructures.RightShift,
            GenericLanguageStructures.Equality,
            GenericLanguageStructures.Identity,
            GenericLanguageStructures.Inequality,
            GenericLanguageStructures.NotIdentity,
            GenericLanguageStructures.CompAnd,
            GenericLanguageStructures.CompOr,
            GenericLanguageStructures.Xor,
            GenericLanguageStructures.AdditionAssignment,
            GenericLanguageStructures.SubtractionAssignment,
            GenericLanguageStructures.MultiplicationAssignment,
            GenericLanguageStructures.DivisionAssignment,
            GenericLanguageStructures.ModulusAssignment,
            GenericLanguageStructures.ConcatenationAssignment,
            GenericLanguageStructures.BitwiseAndAssignment,
            GenericLanguageStructures.BitwiseOrAssignment,
            GenericLanguageStructures.BitwiseXorAssignment,
            GenericLanguageStructures.LeftShiftAssignment,
            GenericLanguageStructures.RightShiftAssignment,
        ],

        bladeEchoEnabled: true,
        bladeEchoRules: [],

        documentRules: {
            includeWhen: [],
            excludeWhen: []
        },
        stringRules: {
            includeWhen: [],
            excludeWhen: []
        }
    };
}

export function classConfigFromObject(config: any): IClassStringConfiguration {
    const defaults = getDefaultClassStringConfig();

    function validateRuleset(ruleset: IClassRuleset): IClassRuleset {
        return {
            includeWhen: ruleset.includeWhen ?? [],
            excludeWhen: ruleset.excludeWhen ?? []
        };
    }

    function getSingleRuleset(config:any, defaults:IClassRuleset): IClassRuleset {
        if (!config) {
            return defaults;
        }

        if (!config.includeWhen && !config.excludeWhen) {
            return defaults;
        }

        return {
            excludeWhen: config.excludeWhen ?? [],
            includeWhen: config.includeWhen ?? []
        };
    }

    return {
        enabled: config.enabled ?? defaults.enabled,
        allowedMethodNames: config.allowedMethodNames ?? defaults.allowedMethodNames,
        directivesEnabled: config.directivesEnabled ?? defaults.directivesEnabled,
        excludedDirectives: config.excludedDirectives ?? defaults.excludedDirectives,
        directives: (config.directives ?? defaults.directives).map(validateRuleset),
        bladePhpEnabled: config.bladePhpEnabled ?? defaults.bladePhpEnabled,
        phpTagsEnabled: config.phpTagsEnabled ?? defaults.phpTagsEnabled,
        phpTagRules: (config.phpTagRules ?? defaults.phpTagRules).map(validateRuleset),
        ignoredLanguageStructures: config.ignoredLanguageStructures ?? defaults.ignoredLanguageStructures,
        bladeEchoEnabled: config.bladeEchoEnabled ?? defaults.bladeEchoEnabled,
        bladeEchoRules: (config.bladeEchoRules ?? defaults.bladeEchoRules).map(validateRuleset),
        documentRules: getSingleRuleset(config.documentRules, defaults.documentRules),
        stringRules: getSingleRuleset(config.stringRules, defaults.stringRules)
    };
}

export class ClassStringRuleEngine {
    private config: IClassStringConfiguration;

    private directiveExcludeRules: string[] = [];
    private directiveIncludeRules: string[] = [];

    private phpTagExcludeRules: string[] = [];
    private phpTagIncludeRules: string[] = [];

    private echoExcludeRules: string[] = [];
    private echoIncludeRules: string[] = [];

    private documentExcludeRules: string[] = [];
    private documentIncludeRules: string[] = [];

    private stringExcludeRules: string[] = [];
    private stringIncludeRules: string[] = [];

    constructor(config: IClassStringConfiguration) {
        this.config = config;

        // Build up the internal reference lists.
        this.directiveExcludeRules = this.getExcludeRules(config.directives);
        this.directiveIncludeRules = this.getIncludeRules(config.directives);

        this.phpTagExcludeRules = this.getExcludeRules(config.phpTagRules);
        this.phpTagIncludeRules = this.getIncludeRules(config.phpTagRules);

        this.echoExcludeRules = this.getExcludeRules(config.bladeEchoRules);
        this.echoIncludeRules = this.getIncludeRules(config.bladeEchoRules);

        this.documentExcludeRules = config.documentRules.excludeWhen;
        this.documentIncludeRules = config.documentRules.includeWhen;

        this.stringExcludeRules = config.stringRules.excludeWhen;
        this.stringIncludeRules = config.stringRules.includeWhen;
    }

    private getIncludeRules(rules: IClassRuleset[]): string[] {
        let includeRules: string[] = [];

        rules.forEach((rule) => {
            includeRules = includeRules.concat(rule.includeWhen);
        });

        return includeRules;
    }

    private getExcludeRules(rules: IClassRuleset[]): string[] {
        let excludeRules: string[] = [];

        rules.forEach((rule) => {
            excludeRules = excludeRules.concat(rule.excludeWhen);
        });

        return excludeRules;
    }

    private passes(content: string, patterns: string[]): boolean {
        if (patterns.length == 0) {
            return true;
        }

        for (let i = 0; i < patterns.length; i++) {
            if ((new RegExp(patterns[i])).test(content)) {
                return true;
            }
        }

        return false;
    }

    canTransformDocument(document: BladeDocument): boolean {
        if (!this.config.enabled) {
            return false;
        }

        const docText = document.getContent();

        if (this.documentExcludeRules.length > 0 && !this.passes(docText, this.documentExcludeRules)) {
            return false;
        }

        return this.passes(docText, this.documentIncludeRules);
    }

    canTransformString(content: string) {
        if (this.stringExcludeRules.length > 0 && this.passes(content, this.stringExcludeRules)) {
            return false;
        }

        return this.passes(content, this.stringIncludeRules);
    }

    private canTransform(content: string, specificExcludes: string[], specificIncludes: string[]): boolean {
        if (specificExcludes.length > 0 && this.passes(content, specificExcludes)) {
            return false;
        }

        if (!this.passes(content, specificIncludes)) {
            return false;
        }

        // Test against the generic rules, if available.
        if (this.stringExcludeRules.length > 0 && this.passes(content, this.stringExcludeRules)) {
            return false;
        }

        return this.passes(content, this.stringIncludeRules);
    }

    canTransformBladeEcho(echo: BladeEchoNode): boolean {
        if (!this.config.enabled || !this.config.bladeEchoEnabled) {
            return false;
        }

        return this.canTransform(echo.content, this.echoExcludeRules, this.echoIncludeRules);
    }

    canTransformBladePhp(bladePhp: DirectiveNode): boolean {
        if (!this.config.enabled || !this.config.bladePhpEnabled) {
            return false;
        }

        return this.canTransform(bladePhp.documentContent, this.phpTagExcludeRules, this.phpTagIncludeRules);
    }

    canTransformInlinePhp(inlinePhp: InlinePhpNode): boolean {
        if (!this.config.enabled || !this.config.phpTagsEnabled) {
            return false;
        }

        return this.canTransform(inlinePhp.sourceContent, this.phpTagExcludeRules, this.phpTagIncludeRules);
    }

    canTransformDirective(directiveNode: DirectiveNode): boolean {
        if (!this.config.enabled || !this.config.directivesEnabled) {
            return false;
        }

        let checkName = directiveNode.directiveName;

        if (directiveNode.originalAbstractNode != null) {
            if (directiveNode.originalAbstractNode instanceof DirectiveNode) {
                checkName = directiveNode.originalAbstractNode.directiveName;
            }
        }

        checkName = checkName.toLowerCase();

        if (this.config.excludedDirectives.length > 0 && (this.config.excludedDirectives.includes(checkName) || this.config.excludedDirectives.includes(directiveNode.directiveName.toLocaleLowerCase()))) {
            return false;
        }

        return this.canTransform(directiveNode.sourceContent, this.directiveExcludeRules, this.directiveIncludeRules);
    }
}