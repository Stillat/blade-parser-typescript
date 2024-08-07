import { StringRemover } from './stringRemover.js';
import { ConditionalRewriteAnalyzer } from '../analyzers/conditionalRewriteAnalyzer.js';
import { DirectivePairAnalyzer } from '../analyzers/directivePairAnalyzer.js';
import { DirectiveStack } from '../analyzers/directiveStack.js';
import { FragmentPositionAnalyzer } from '../analyzers/fragmentPositionAnalyzer.js';
import { InlineEchoAnalyzer } from '../analyzers/inlineEchoAnalyzer.js';
import { InlinePhpAnalyzer } from '../analyzers/inlinePhpAnalyzer.js';
import { PairManager } from '../analyzers/pairManager.js';
import { BladeDocument } from '../document/bladeDocument.js';
import { WordScanner } from '../document/scanners/wordScanner.js';
import { BladeError, ErrrorLevel } from '../errors/bladeError.js';
import { BladeErrorCodes } from '../errors/bladeErrorCodes.js';
import { getStartPosition } from '../nodes/helpers.js';
import { AbstractNode, BladeCommentNode, BladeComponentNode, BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode, ConditionNode, DirectiveNode, ForElseNode, FragmentPosition, InlinePhpNode, LiteralNode, ShorthandInlinePhpNode, SwitchStatementNode } from '../nodes/nodes.js';
import { Position } from '../nodes/position.js';
import { StringUtilities } from '../utilities/stringUtilities.js';
import { BladeKeywords } from './bladeKeywords.js';
import { ComponentParser } from './componentParser.js';
import { DocumentIndex } from './documentIndex.js';
import { DocumentOffset } from './documentOffset.js';
import { FragmentsParser } from './fragmentsParser.js';
import { IndexRange } from './indexRange.js';
import { LineOffset } from './lineOffset.js';
import { getParserOptions, ParserOptions } from './parserOptions.js';
import { PhpValidator } from './php/phpValidator.js';
import { isStartOfString } from './scanners/isStartOfString.js';
import { nextNonWhitespace } from './scanners/nextNonWhitespace.js';
import { scanToEndOfLogicGroup } from './scanners/scanToEndOfLogicGroup.js';
import { skipToEndOfLine } from './scanners/skipToEndOfLine.js';
import { skipToEndOfMultilineComment } from './scanners/skipToEndOfMultilineComment.js';
import { skipToEndOfString, skipToEndOfStringTraced } from './scanners/skipToEndOfString.js';
import { LogicGroupScanResults } from './scanResults.js';
import { StringIterator } from './stringIterator.js';
import { FragmentsTransformer } from '../document/fragmentTransformer.js';

export class DocumentParser implements StringIterator {
    static readonly K_CHAR = 'char';
    static readonly K_LINE = 'line';
    static readonly NewLine = "\n";
    static readonly AtChar = '@';
    static readonly Punctuation_Colon = ':';
    static readonly Punctuation_QuestionMark = '?';
    static readonly LeftParen = '(';
    static readonly RightParen = ')';
    static readonly LeftBrace = '{';
    static readonly RightBrace = '}';
    static readonly String_Terminator_DoubleQuote = '"';
    static readonly String_Terminator_SingleQuote = "'";
    static readonly Punctuation_LessThan = '<';
    static readonly Punctuation_GreaterThan = '>';
    static readonly Punctuation_Equals = '=';
    static readonly Punctuation_Exclamation = '!';
    static readonly LeftBracket = '[';
    static readonly RightBracket = ']';
    static readonly Punctuation_Comma = ',';
    static readonly Punctuation_Minus = '-';
    static readonly Punctuation_Asterisk = '*';
    static readonly Punctuation_ForwardSlash = '/';
    static readonly Punctuation_Underscore = '_';
    static readonly String_EscapeCharacter = '\\';

    private componentParser: ComponentParser;
    private nodes: AbstractNode[] = [];
    private renderNodes: AbstractNode[] = [];
    private chars: string[] = [];
    private currentIndex = 0;
    private currentContent: string[] = [];
    private cur: string | null = null;
    private next: string | null = null;
    private prev: string | null = null;
    private charLen = 0;
    private inputLen = 0;
    private maxLine = 1;
    private chunkSize = 5;
    private currentChunkOffset = 0;
    private parsingOffset = 0;
    private isVerbatim = false;
    private isPhpNode = false;
    private bladeStartIndex: number[] = [];
    private bladeStartPositionIndex: Map<number, number> = new Map();
    private lastBladeEndIndex = -1;
    private lastNode: AbstractNode | null = null;
    private documentOffsets: Map<number, DocumentOffset> = new Map();
    private lineIndex: Map<number, LineOffset> = new Map();
    private lastDocumentOffsetKey: number | null = null;
    private content = '';
    private originalContent = '';
    private seedOffset = 0;
    private seedStartLine = 1;
    private shiftLine = 0;
    private isParsingComponent = false;
    private shouldIgnoreStructures = false;
    private fragmentsParser: FragmentsParser;
    private fragmentsAnalyzer: FragmentPositionAnalyzer;
    private pushedErrors: Map<string, BladeError> = new Map();
    private errors: BladeError[] = [];
    private structureErrors: BladeError[] = [];
    private doesHaveUnclosedIfStructures = false;
    private doesHaveUnclosedSwitchStructures = false;
    private doesHaveUnclosedComments = false;
    private doesHaveUnclosedRegions = false;
    private parserOptions: ParserOptions;
    private phpValidator: PhpValidator | null = null;
    private didRecoveryLogic: boolean = false;
    private parseFragments: boolean = true;
    private hasPairedStructures: boolean = false;
    private hasComponents: boolean = false;
    private hasPhpContent: boolean = false;

    constructor() {
        this.componentParser = new ComponentParser(this);
        this.fragmentsParser = new FragmentsParser();
        this.fragmentsAnalyzer = new FragmentPositionAnalyzer(this, this.fragmentsParser);

        this.parserOptions = getParserOptions();
    }
    
    advance(count: number) {
        for (let i = 0; i < count; i++) {
            this.currentIndex++;
            this.checkCurrentOffsets();
        }
    }

    encounteredFailure() {
        this.didRecoveryLogic = true;
    }
    withPhpValidator(validator: PhpValidator | null) {
        this.phpValidator = validator;

        return this;
    }

    getPhpValidator(): PhpValidator | null {
        return this.phpValidator;
    }

    withParserOptions(options: ParserOptions) {
        this.parserOptions = options;

        return this;
    }

    getParserOptions() {
        return this.parserOptions;
    }

    hasUnclosedIfStructures() {
        return this.doesHaveUnclosedIfStructures;
    }

    hasUnclosedSwitchStructures() {
        return this.doesHaveUnclosedSwitchStructures;
    }

    hasUnclosedComments() {
        return this.doesHaveUnclosedComments;
    }

    hasUnclosedRegions() {
        return this.doesHaveUnclosedRegions;
    }

    hasUnclosedStructures() {
        return this.doesHaveUnclosedComments || this.doesHaveUnclosedIfStructures || this.doesHaveUnclosedSwitchStructures || this.doesHaveUnclosedRegions;
    }

    getErrors(): BladeError[] {
        return this.errors;
    }

    getStructureErrors(): BladeError[] {
        return this.structureErrors;
    }

    updateIndex(index: number): void {
        this.currentIndex = index;
    }

    inputLength(): number {
        return this.inputLen;
    }

    incrementIndex(): void {
        this.currentIndex += 1;
    }

    getCurrentIndex(): number {
        return this.currentIndex;
    }

    getCurrent(): string | null {
        return this.cur;
    }

    getNext(): string | null {
        return this.next;
    }

    getPrev(): string | null {
        return this.prev;
    }

    getChar(index: number) {
        return this.chars[index];
    }

    pushChar(value: string) {
        this.currentContent.push(value);
    }

    getSeedOffset(): number {
        return this.seedOffset;
    }

    getContentSubstring(from: number, length: number): string {
        return this.content.substr(from, length);
    }

    protected resetIntermediateState() {
        this.chars = [];
        this.charLen = 0;
        this.currentIndex = 0;
        this.currentContent = [];
        this.cur = null;
        this.next = null;
        this.prev = null;
    }

    setSeedPosition(position: Position | null) {
        if (position == null) {
            this.shiftLine = 0;
        } else {
            this.shiftLine = position.line;
        }

        return this;
    }

    resetState() {
        this.nodes = [];
        this.renderNodes = [];
        this.charLen = 0;
        this.bladeStartIndex = [];
        this.lastBladeEndIndex = -1;
    }

    getHasPhpContent(): boolean {
        return this.hasPhpContent;
    }

    getDidRecovery(): boolean {
        return this.didRecoveryLogic;
    }

    private isStartingPhp() {
        if (this.cur == DocumentParser.Punctuation_LessThan && this.next == DocumentParser.Punctuation_QuestionMark) {
            const fetch = this.fetchAt(this.currentChunkOffset, 5).toLowerCase();

            return fetch == '<?php';
        }

        return false;
    }

    private isStartingShorthandPhp() {
        if (this.cur == DocumentParser.Punctuation_LessThan && this.next == DocumentParser.Punctuation_QuestionMark) {
            const fetch = this.fetchAt(this.currentChunkOffset, 3).toLowerCase();

            return fetch == '<?=';
        }

        return false;
    }

    private isStartingDirective() {
        if (this.next != null) {
            if (!StringUtilities.ctypeAlpha(this.next)) {
                return false;
            }
        }
        if (this.cur == DocumentParser.AtChar && this.next != null && this.prev != DocumentParser.AtChar) {
            if (! StringUtilities.ctypeSpace(this.prev)) {
                return false;
            }

            return true;
        }

        return false;
    }

    private isClosingComponent() {
        if (this.cur == DocumentParser.Punctuation_GreaterThan && (this.prev != DocumentParser.Punctuation_Minus && this.prev != DocumentParser.Punctuation_Equals)) {
            return true;
        }

        return false;
    }

    private isStartingClosingComponentTag() {
        if (this.cur == DocumentParser.Punctuation_LessThan &&
            this.next == DocumentParser.Punctuation_ForwardSlash
            && this.peekRelative(2) == 'x' && (this.peekRelative(3) == DocumentParser.Punctuation_Minus || this.peekRelative(3) == DocumentParser.Punctuation_Colon)) {
            return true;
        }

        return false;
    }

    private isStartingOpeningComponentTag() {
        if (this.cur == DocumentParser.Punctuation_LessThan && this.next == 'x' && (this.peekRelative(2) == DocumentParser.Punctuation_Minus || this.peekRelative(2) == DocumentParser.Punctuation_Colon)) {
            return true;
        }

        return false;
    }

    private isStartingEscapedEcho() {
        if ((this.prev == null || (this.prev != null && this.prev != DocumentParser.AtChar)) && this.next == DocumentParser.Punctuation_Exclamation) {
            if (this.cur == DocumentParser.LeftBrace && this.peek(2) == DocumentParser.Punctuation_Exclamation) {
                return true;
            }
        }

        return false;
    }

    private isStartingBladeNodeStructure() {
        if ((this.prev == null || (this.prev != null && this.prev != DocumentParser.AtChar)) && this.next == DocumentParser.LeftBrace) {
            if (this.cur == DocumentParser.LeftBrace && this.next == DocumentParser.LeftBrace) {
                return true;
            }
        }

        return false;
    }

    private hasEncounteredAnotherStructure() {
        if (this.shouldIgnoreStructures) {
            return false;
        }

        if (this.isStartingOpeningComponentTag()) {
            return true;
        }

        if (this.isParsingComponent) {
            return false;
        }

        if (this.isStartingClosingComponentTag() ||
            this.isStartingDirective() ||
            this.isStartingEscapedEcho() ||
            this.isStartingBladeNodeStructure()) {
            return true;
        }

        return false;
    }

    private endsWithTld(s: string): boolean {
        const regex = /\.[a-z]{2,63}$/i;

        return regex.test(s);
    }

    private processInputText(input: string) {
        this.originalContent = input;
        this.content = StringUtilities.normalizeLineEndings(input);
        this.inputLen = this.content.length;

        const documentNewLines = [...this.content.matchAll(/(\n)/gm)];
        const newLineCountLen = documentNewLines.length;

        let currentLine = this.seedStartLine,
            lastOffset: number | null = null,
            lastStartIndex = 0,
            lastEndIndex = 0;

        for (let i = 0; i < newLineCountLen; i++) {
            const thisNewLine = documentNewLines[i],
                thisIndex = thisNewLine.index ?? 0;
            let indexChar = thisIndex;

            if (lastOffset != null) {
                indexChar = thisIndex - lastOffset;
            } else {
                indexChar = indexChar + 1;
            }

            this.documentOffsets.set(thisIndex, {
                char: indexChar,
                line: currentLine
            });

            let thisStartIndex = 0,
                thisEndIndex = 0;

            if (i == 0) {
                thisEndIndex = indexChar - 1;
                thisStartIndex = 0;
            } else {
                thisStartIndex = lastEndIndex + 1;
                thisEndIndex = thisIndex;
            }

            this.lineIndex.set(currentLine, {
                char: indexChar,
                line: currentLine,
                startIndex: thisStartIndex,
                endIndex: thisEndIndex
            });

            this.lastDocumentOffsetKey = thisIndex;
            this.maxLine = currentLine;

            currentLine += 1;
            lastOffset = thisIndex;

            lastEndIndex = thisEndIndex;
            lastStartIndex = thisStartIndex;
        }

        this.maxLine += 1;

        const bladeStartCandidates = [...this.content.matchAll(/({{|<\?php|<\?=|@?{!!|@|<x-|<\/x-|<x:|<\/x:)/gm)];

        let lastBladeOffset = 0,
            lastWasEscaped = false,
            lastWasEscapedDirective = false,
            lastMatch:RegExpMatchArray | null,
            lastAbandonedFromEmail = false;

        bladeStartCandidates.forEach((bladeRegion) => {
            if (lastWasEscapedDirective) {
                if (lastMatch != null) {
                    const diff = (bladeRegion.index ?? 0) - (lastMatch.index ?? 0);

                    if (diff > 1) {
                        lastWasEscaped = false;
                        lastWasEscapedDirective = false;
                        lastBladeOffset = bladeRegion.index ?? 0;
                    }
                }
            } else {
                if (lastAbandonedFromEmail && bladeRegion.index) {
                    lastBladeOffset = bladeRegion.index ?? 0;
                    lastAbandonedFromEmail = false;
                }
            }

            const matchText = bladeRegion[0],
                seekIndex = this.content.indexOf(matchText, lastBladeOffset),
                seekText = this.content.substr(seekIndex, 10);

            if (seekText.startsWith('@@') || seekText.startsWith('@{{')) {
                lastBladeOffset = this.content.indexOf(matchText, lastBladeOffset); // + 2;
                lastWasEscaped = true;
                
                if (seekText.startsWith('@@')) {
                    lastWasEscapedDirective = true;
                } else {
                    lastWasEscapedDirective = false;
                }

                lastMatch = bladeRegion;
                return;
            }

            const offset = this.content.indexOf(matchText, lastBladeOffset);

            if (lastWasEscaped) {
                if (lastMatch != null) {
                    const diff = (bladeRegion.index ?? 0) - (lastMatch.index ?? 0);

                    if (diff <= 1) {
                        lastBladeOffset = offset;
                        lastMatch = bladeRegion;
                        return;
                    } else {
                        lastWasEscaped = false;
                    }
                }
                if (lastBladeOffset == offset || (offset - lastBladeOffset) <= 1) {
                    lastBladeOffset = offset;
                    lastMatch = bladeRegion;
                    return;
                } else {
                    lastWasEscaped = false;
                }
            }

            let prefetchLength = 3,
                shouldCheckForIgnoredDirectives = false,
                exclusiveDirectivesSupplied = false;
            const lowerIgnoreDirectives: string[] = [],
                lowerExclusiveDirectives: string[] = [];

            if (this.parserOptions.ignoreDirectives.length > 0) {
                this.parserOptions.ignoreDirectives.forEach((directive) => {
                    lowerIgnoreDirectives.push(directive.toLowerCase());

                    if (directive.length > prefetchLength) {
                        prefetchLength = directive.length;
                    }
                });
                prefetchLength += 5;
                shouldCheckForIgnoredDirectives = true;
            }

            if (this.parserOptions.directives.length > 0) {
                prefetchLength = 3;

                this.parserOptions.directives.forEach((directive) => {
                    lowerExclusiveDirectives.push(directive.toLowerCase());

                    if (directive.length > prefetchLength) {
                        prefetchLength = directive.length;
                    }
                });
                prefetchLength += 5;
                shouldCheckForIgnoredDirectives = false;
                exclusiveDirectivesSupplied = true;
            }

            const preFetch = this.fetchAt(offset, prefetchLength);

            if (preFetch.includes('.')) {
                let preFetchCheck = preFetch;

                if (preFetch.includes("\n")) {
                    preFetchCheck = StringUtilities.breakByNewLine(preFetchCheck)[0];
                }

                const rmResults = StringRemover.fromText(preFetchCheck);

                if (rmResults.includes('.') && this.endsWithTld(rmResults)) {
                    lastMatch = bladeRegion;
                    lastAbandonedFromEmail = true;
                    return;
                }
            }

            if (preFetch.startsWith('@{') == false) {
                const firstChar = preFetch.substring(0, 1),
                    secondChar = preFetch.substring(1, 2);

                if (firstChar == '@' && StringUtilities.ctypeAlpha(secondChar)) {
                    if (exclusiveDirectivesSupplied) {
                        const checkPrefetch = this.breakPreFetch(preFetch).toLowerCase();

                        if (lowerExclusiveDirectives.includes(checkPrefetch)) {
                            this.bladeStartIndex.push(offset);
                        }
                    } else {
                        if (shouldCheckForIgnoredDirectives) {
                            const checkPrefetch = this.breakPreFetch(preFetch).toLowerCase();

                            if (!lowerIgnoreDirectives.includes(checkPrefetch)) {
                                if (! checkPrefetch.endsWith('{')) {
                                    this.bladeStartIndex.push(offset);
                                }
                            }
                        } else {
                            this.bladeStartIndex.push(offset);
                        }
                    }
                } else if (firstChar != '@') {
                    this.bladeStartIndex.push(offset);
                }
            }
            this.bladeStartPositionIndex.set(offset, 1);
            lastBladeOffset = offset + 2;
            lastWasEscaped = false;
            lastMatch = bladeRegion;
        });

        this.fragmentsParser
            .setDocumentOffsets(this.documentOffsets, this.lastDocumentOffsetKey);

        return true;
    }

    private breakPreFetch(value: string): string {
        const wsParts = StringUtilities.replaceAllInString(StringUtilities.normalizeLineEndings(value), "\n", ' ').split(' '),
            parenParts = wsParts[0].split('(');

        let candidate = parenParts[0].trim();

        if (candidate.startsWith('@')) {
            candidate = candidate.substring(1);
        }

        if (candidate.includes('=')) {
            candidate = candidate.substring(0, candidate.indexOf('='));
        }

        return candidate.toLowerCase();
    }

    private fetchAt(start: number, length: number) {
        return this.content.substr(start, length);
    }

    private shouldSkipForward() {
        if (this.lastNode == null) { return true; }

        if (this.lastNode instanceof DirectiveNode) {
            if (this.lastNode.directiveName == BladeKeywords.Verbatim || this.lastNode.directiveName == BladeKeywords.Php) {
                return false;
            }
        }

        return true;
    }

    private unclosedRegionErrors: string[] = [
        BladeErrorCodes.TYPE_UNEXPECTED_END_OF_INPUT,
        BladeErrorCodes.TYPE_UNCLOSED_PHP_DIRECTIVE,
        BladeErrorCodes.TYPE_UNPAIRED_PHP_CLOSING_DIRECTIVE,
        BladeErrorCodes.TYPE_UNCLOSED_VERBATIM,
        BladeErrorCodes.TYPE_UNPAIRED_VERBATIM_CLOSING_DIRECTIVE,
        BladeErrorCodes.TYPE_UNCLOSED_FOR_DIRECTIVE,
        BladeErrorCodes.TYPE_UNPAIRED_FOR_CLOSING_DIRECTIVE,
        BladeErrorCodes.TYPE_UNCLOSED_FOR_ELSE_DIRECTIVE,
        BladeErrorCodes.TYPE_UNPAIRED_FOR_ELSE_CLOSING_DIRECTIVE
    ];

    setParseFragments(parseFragments:boolean) {
        this.parseFragments = parseFragments;
    }

    pushError(error: BladeError) {
        const errorHash = error.hash();

        if (!this.pushedErrors.has(errorHash)) {
            if (error.errorCode == BladeErrorCodes.TYPE_PARSE_UNCLOSED_CONDITION) {
                this.doesHaveUnclosedIfStructures = true;
                this.structureErrors.push(error);
            } else if (error.errorCode == BladeErrorCodes.TYPE_PARSE_UNCLOSED_SWITCH) {
                this.doesHaveUnclosedSwitchStructures = true;
                this.structureErrors.push(error);
            } else if (error.errorCode == BladeErrorCodes.TYPE_UNCLOSED_COMMENT) {
                this.doesHaveUnclosedComments = true;
                this.structureErrors.push(error);
            } else if (this.unclosedRegionErrors.includes(error.errorCode)) {
                this.doesHaveUnclosedRegions = true;
                this.structureErrors.push(error);
            }

            this.pushedErrors.set(errorHash, error);
            this.errors.push(error);
        }
    }

    getContent() {
        return this.content;
    }

    getOriginalContent() {
        return this.originalContent;
    }

    getFragments() {
        return this.fragmentsParser.getFragments();
    }

    getFragmentsParser() {
        return this.fragmentsParser;
    }

    getFragmentsContainingStructures() {
        return this.fragmentsParser.getFragmentsContainingStructures();
    }

    charLeftAt(position: Position | null) {
        if (position == null) {
            return null;
        }

        if (position.char <= 1) {
            return null;
        }

        return this.charAt(this.positionFromCursor(position.line, position.char - 1));
    }

    charLeftAtCursor(line: number, char: number) {
        return this.charLeftAt(this.positionFromCursor(line, char));
    }

    charRightAt(position: Position | null) {
        if (position == null) {
            return null;
        }

        return this.charAt(this.positionFromCursor(position.line, position.char + 1));
    }

    charRightAtCursor(line: number, char: number) {
        return this.charRightAt(this.positionFromCursor(line, char));
    }

    punctuationLeftAt(position: Position | null, tabSize = 4) {
        if (position == null) {
            return null;
        }

        const lineText = this.getLineText(position.line);

        if (lineText == null) {
            return null;
        }

        return WordScanner.findLeftNeighboringNextPunctuation(position.char, lineText, tabSize);
    }

    punctuationLeftAtCursor(line: number, char: number, tabSize = 4) {
        return this.punctuationLeftAt(this.positionFromCursor(line, char), tabSize);
    }

    punctuationRightAt(position: Position | null, tabSize = 4) {
        if (position == null) {
            return null;
        }

        const lineText = this.getLineText(position.line);

        if (lineText == null) {
            return null;
        }

        return WordScanner.findRightBeighboringNextPunctuation(position.char, lineText, tabSize);
    }

    punctuationRightAtCursor(line: number, char: number, tabSize = 4) {
        return this.punctuationRightAt(this.positionFromCursor(line, char), tabSize);
    }

    wordRightAt(position: Position | null, tabSize = 4) {
        if (position == null) {
            return null;
        }

        const lineText = this.getLineText(position.line);

        if (lineText == null) {
            return null;
        }

        const rightWordChar = WordScanner.findRightNeighboringNextAlphaNumeric(position.char, lineText, tabSize);

        if (rightWordChar == null) {
            return null;
        }

        return WordScanner.scanWordAt(rightWordChar, lineText, tabSize);
    }

    wordRightAtCursor(line: number, char: number, tabSize = 4) {
        return this.wordRightAt(this.positionFromCursor(line, char), tabSize);
    }

    wordLeftAt(position: Position | null, tabSize = 4) {
        if (position == null) {
            return null;
        }

        const lineText = this.getLineText(position.line);

        if (lineText == null) {
            return null;
        }

        const leftWordChar = WordScanner.findLeftNeighboringNextAlphaNumeric(position.char, lineText, tabSize);

        if (leftWordChar == null) {
            return null;
        }

        return WordScanner.scanWordAt(leftWordChar, lineText, tabSize);
    }

    wordLeftAtCursor(line: number, char: number, tabSize = 4) {
        return this.wordLeftAt(this.positionFromCursor(line, char), tabSize);
    }

    wordAt(position: Position | null, tabSize = 4) {
        if (position == null) {
            return null;
        }

        const lineText = this.getLineText(position.line);

        if (lineText == null) {
            return null;
        }

        return WordScanner.scanWordAt(position.char, lineText, tabSize);
    }

    getLineText(lineNumber: number): string | null {
        const index = this.getLineIndex(lineNumber);

        if (index != null) {
            return StringUtilities.trimRight(this.getContent().substring(index.start, index.end + 1));
        }

        return null;
    }

    wordAtCursor(line: number, char: number, tabSize = 4) {
        return this.wordAt(this.positionFromCursor(line, char), tabSize);
    }

    charAt(position: Position | null) {
        if (position == null) {
            return null;
        }

        return this.content.substr(position.offset, 1);
    }

    getLinesAround(line: number): Map<number, string> {
        const lines: Map<number, string> = new Map();

        let startLine = line - 3,
            endLine = line + 3;

        if (startLine < 1) {
            startLine = 1;
        }

        if (endLine > this.maxLine) {
            endLine = this.maxLine;
        }

        for (let i = startLine; i <= endLine; i++) {
            lines.set(i, this.getLineText(i) ?? '');
        }

        return lines;
    }

    charAtCursor(line: number, char: number) {
        return this.charAt(this.positionFromCursor(line, char));
    }

    getLineIndex(line: number): DocumentIndex | null {
        if (line == this.maxLine) {
            const lastIndex = this.lineIndex.get(line - 1);

            if (lastIndex != null) {
                const startIndex = lastIndex.endIndex + 1,
                    endIndex = this.inputLen - 1;

                return {
                    end: endIndex,
                    start: startIndex
                };
            }

            return null;
        }

        const indexEntry = this.lineIndex.get(line);

        if (indexEntry != null) {
            return {
                start: indexEntry.startIndex,
                end: indexEntry.endIndex
            };
        }

        return null;
    }

    getHasPairedStructures(): boolean {
        return this.hasPairedStructures;
    }

    getHasComponents(): boolean {
        return this.hasComponents;
    }

    positionFromCursor(line: number, char: number): Position | null {
        if (line == this.maxLine) {
            const lastIndex = this.lineIndex.get(line - 1);

            if (lastIndex != null) {
                const startIndex = lastIndex.endIndex + 1,
                    thisOffset = startIndex + (char - 1);

                const position = new Position();
                position.offset = thisOffset;
                position.line = line;
                position.char = char;
                position.index = thisOffset;

                return position;
            }

            return null;
        }

        const indexEntry = this.lineIndex.get(line);

        if (indexEntry != null) {
            const position = new Position();
            position.offset = indexEntry.startIndex + (char - 1);
            position.line = indexEntry.line;
            position.char = char;
            position.index = indexEntry.startIndex + (char - 1);

            return position;
        }

        return null;
    }

    parse(text: string) {
        PairManager.customIfs.clear();

        this.parserOptions.customIfs.forEach((customIf) => {
            PairManager.customIfs.set(customIf, 1);
        });

        if (!this.processInputText(text)) {
            return [];
        }

        const indexCount = this.bladeStartIndex.length,
            lastIndex = indexCount - 1;

        if (indexCount == 0 && !this.isVerbatim) {
            const fullDocumentLiteral = new LiteralNode();
            fullDocumentLiteral.withParser(this);
            fullDocumentLiteral.content = this.prepareLiteralContent(this.content);
            fullDocumentLiteral.startPosition = this.positionFromOffset(0, 0);
            fullDocumentLiteral.endPosition = this.positionFromOffset(this.inputLen - 1, this.inputLen - 1);
            this.nodes.push(fullDocumentLiteral);
        } else {
            for (let i = 0; i < indexCount; i += 1) {
                let offset = this.bladeStartIndex[i];
                this.seedOffset = offset;

                if (i == 0 && offset > 0 && !this.isVerbatim) {
                    const node = new LiteralNode();
                    node.withParser(this);
                    node.content = this.prepareLiteralContent(
                        this.content.substr(0, offset)
                    );

                    if (node.content.length > 0) {
                        node.startPosition = this.positionFromOffset(0, 0);
                        node.endPosition = this.positionFromOffset(offset, offset - 1);
                        this.nodes.push(node);
                    }
                }

                if (offset < this.lastBladeEndIndex) {
                    continue;
                }

                this.currentChunkOffset = offset;
                this.parsingOffset = offset;
                this.resetIntermediateState();
                this.parseIntermediateText(offset);

                if (this.isVerbatim) {
                    let found = false;
                    for (let j = i + 1; j < this.bladeStartIndex.length; j++) {
                        const checkIndex = this.bladeStartIndex[j],
                            thisChunk = this.fetchAt(checkIndex, 12);

                        if (thisChunk == '@endverbatim') {
                            i = j - 1;
                            this.isVerbatim = false;
                            found = true;
                            break;
                        }
                    }

                    if (found) { continue; }
                }

                if (this.isPhpNode) {
                    let found = false;
                    for (let j = i + 1; j < this.bladeStartIndex.length; j++) {
                        const checkIndex = this.bladeStartIndex[j],
                            thisChunk = this.fetchAt(checkIndex, 7);

                        if (thisChunk == '@endphp') {
                            i = j - 1;
                            this.isPhpNode = false;
                            found = true;
                            break;
                        }
                    }

                    if (found) { continue; }
                }

                if (this.lastNode instanceof BladeCommentNode || this.lastNode instanceof InlinePhpNode) {
                    let seekLiteralIndex = -1;

                    for (let j = i; j < this.bladeStartIndex.length; j++) {
                        const checkIndex = this.bladeStartIndex[j];

                        if (checkIndex > this.lastBladeEndIndex) {
                            seekLiteralIndex = checkIndex;
                            break;
                        }
                    }

                    if (seekLiteralIndex != -1) {
                        let literalOffset = 1;

                        if (this.lastNode instanceof InlinePhpNode) {
                            literalOffset = 0;
                        }

                        const literalStart = this.lastBladeEndIndex + literalOffset,
                            literalContent = this.content.substr(this.lastBladeEndIndex + literalOffset, seekLiteralIndex - this.lastBladeEndIndex - literalOffset),
                            literalEnd = seekLiteralIndex - 1;
                        const literalNode = new LiteralNode();
                        literalNode.withParser(this);
                        literalNode.startPosition = this.positionFromOffset(literalStart, literalStart);
                        literalNode.endPosition = this.positionFromOffset(literalEnd, literalEnd);
                        literalNode.content = literalContent;
                        this.nodes.push(literalNode);
                        this.lastNode = literalNode;
                        this.lastBladeEndIndex = literalEnd;
                        continue;
                    }
                }

                if (this.lastNode instanceof BladeComponentNode) {
                    offset -= 2;
                }

                let shouldProduceLiteralNode = false;

                if (!this.bladeStartPositionIndex.has(this.currentChunkOffset)) {
                    shouldProduceLiteralNode = true;
                } else if (this.lastBladeEndIndex < this.currentChunkOffset) {
                    shouldProduceLiteralNode = true;
                }

                if (shouldProduceLiteralNode) {

                    if (i + 1 < indexCount) {
                        let nextBladeStart = this.bladeStartIndex[i + 1];
                        let literalNodeOffset = 1;

                        if (this.lastNode instanceof InlinePhpNode) {
                            literalNodeOffset = 0;
                        }

                        let literalStartIndex = this.lastBladeEndIndex + literalNodeOffset;

                        if (nextBladeStart < literalStartIndex) {
                            if (this.lastBladeEndIndex > nextBladeStart) {
                                if (i + 2 < indexCount) {
                                    nextBladeStart = this.bladeStartIndex[i + 2];
                                }
                            } else {
                                continue;
                            }
                        }

                        if (this.shouldSkipForward()) {
                            for (let j = i; j < this.bladeStartIndex.length; j++) {
                                const checkIndex = this.bladeStartIndex[j];

                                if (checkIndex > this.lastBladeEndIndex) {
                                    nextBladeStart = checkIndex;
                                    break;
                                }
                            }
                        }

                        if (i + 1 == lastIndex && (nextBladeStart <= this.lastBladeEndIndex)) {
                            if (this.isVerbatim) {
                                break;
                            }


                            // In this scenario, we will create the last trailing literal node and break.
                            const thisOffset = this.currentChunkOffset,
                                nodeContent = this.content.substr(literalStartIndex);

                            const literalNode = new LiteralNode();
                            literalNode.withParser(this);
                            literalNode.content = this.prepareLiteralContent(nodeContent);

                            if (literalNode.content.length > 0) {
                                literalNode.startPosition = this.positionFromOffset(thisOffset, thisOffset);
                                literalNode.endPosition = this.positionFromOffset(nextBladeStart, nextBladeStart - 1);
                                this.nodes.push(literalNode);
                            }

                            break;
                        } else {
                            const literalLength = nextBladeStart - this.lastBladeEndIndex - 1;

                            if (literalLength < 0 && this.lastNode instanceof BladeComponentNode) {
                                let allInsideComponent = true;
                                for (let j = i; j < this.bladeStartIndex.length; j++) {
                                    const checkIndex = this.bladeStartIndex[j];

                                    if (checkIndex > this.lastBladeEndIndex) {
                                        nextBladeStart = checkIndex;
                                        allInsideComponent = false;
                                        break;
                                    }
                                }

                                if (allInsideComponent) {
                                    const literalStart = this.currentIndex + offset;

                                    if (literalStart < this.inputLen && !this.isVerbatim) {
                                        const literalNode = new LiteralNode();
                                        literalNode.withParser(this);

                                        literalNode.content = this.prepareLiteralContent(this.content.substr(literalStart));

                                        if (literalNode.content.length > 0) {
                                            literalNode.startPosition = this.positionFromOffset(literalStart, literalStart);
                                            literalNode.endPosition = this.positionFromOffset(this.inputLen - 1, this.inputLen - 1);
                                            this.nodes.push(literalNode);
                                        }

                                        break;
                                    }
                                }
                            }

                            if (literalLength == 0 || this.isVerbatim) {
                                continue;
                            }

                            const shiftedIndex = this.shiftIndexToWhitespace(literalStartIndex),
                                lDiff = literalStartIndex - shiftedIndex;

                            const nodeContent = this.content.substr(
                                shiftedIndex,
                                literalLength + lDiff
                            );

                            const literalNode = new LiteralNode();
                            literalNode.withParser(this);
                            literalNode.content = this.prepareLiteralContent(nodeContent);

                            if (literalNode.content.length > 0) {
                                literalNode.startPosition = this.positionFromOffset(literalStartIndex, literalStartIndex);
                                literalNode.endPosition = this.positionFromOffset(nextBladeStart, nextBladeStart - 1);
                                this.nodes.push(literalNode);
                            }
                        }

                        continue;
                    }

                    if (i !== lastIndex && this.lastNode != null && this.lastNode.endPosition != null) {
                        const startCandidate = this.positionFromOffset(offset, offset);

                        // Skip processing potentital nodes that are inside the last node.
                        if (startCandidate.isBefore(this.lastNode.endPosition)) {
                            if (i + 1 < indexCount) {
                                const nextBladeStart = this.bladeStartIndex[i + 1];

                                if (nextBladeStart < this.lastNode.endPosition.offset) {
                                    continue;
                                }
                            } else {
                                if (i + 1 != lastIndex) {
                                    continue;
                                }
                            }
                        }
                    }

                    if (i == lastIndex) {
                        const literalStart = this.currentIndex + offset;

                        if (literalStart < this.inputLen && !this.isVerbatim) {
                            const literalNode = new LiteralNode();
                            literalNode.withParser(this);

                            literalNode.content = this.prepareLiteralContent(this.content.substr(
                                this.shiftIndexToWhitespace(literalStart)
                            ));

                            if (literalNode.content.length > 0) {
                                literalNode.startPosition = this.positionFromOffset(literalStart, literalStart);
                                literalNode.endPosition = this.positionFromOffset(this.inputLen - 1, this.inputLen - 1);
                                this.nodes.push(literalNode);
                            }

                            break;
                        }
                    }
                }
            }
        }

        // Index the nodes.
        let curIndex = 0;

        this.nodes.forEach((node) => {
            node.index = curIndex;
            curIndex += 1;
        });

        let lastNode: AbstractNode | null = null;

        for (let i = 0; i < this.nodes.length; i++) {
            const thisNode = this.nodes[i];
            let nextNode: AbstractNode | null = null;

            if (i + 1 < this.nodes.length) {
                nextNode = this.nodes[i + 1];
            }

            thisNode.prevNode = lastNode;
            thisNode.nextNode = nextNode;

            lastNode = thisNode;
        }

        // Ask the PairManager to analyze the document to help build up the possible pairs.
        PairManager.determineCandidates(this.nodes);
        this.nodes = ConditionalRewriteAnalyzer.rewrite(this.nodes);
        const pairAnalyzer = new DirectivePairAnalyzer();
        this.renderNodes = pairAnalyzer.associate(this.nodes, this);
        this.hasPairedStructures = pairAnalyzer.getPairsCreated() > 0;

        InlineEchoAnalyzer.analyze(this.nodes);
        InlinePhpAnalyzer.analyze(this.nodes);

        this.nodes.forEach((node) => {
            if (node instanceof DirectiveNode) {
                const directive = node as DirectiveNode,
                    lowerName = directive.directiveName.toLowerCase();

                if (directive.isClosedBy != null) {
                    const directiveChildren = directive.getImmediateChildren();

                    for (let i = 0; i < directiveChildren.length; i++) {
                        const child = directiveChildren[i];

                        if (child instanceof DirectiveNode && child != directive.isClosedBy && child.isClosedBy != null) {
                            directive.containsChildStructures = true;
                            break;
                        } else if (child instanceof ConditionNode || child instanceof SwitchStatementNode || child instanceof ForElseNode) {
                            directive.containsChildStructures = true;
                            break;
                        }
                    }
                }

                if ((lowerName == 'switch' && directive.isClosedBy == null) ||
                    (lowerName == 'endswitch' && directive.isOpenedBy == null)) {
                    directive.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_PARSE_UNCLOSED_SWITCH,
                        directive,
                        'Unclosed switch control structure',
                        ErrrorLevel.Error
                    ));
                } else if (lowerName == 'php') {
                    if (directive.hasDirectiveParameters == false && directive.isClosedBy == null) {
                        directive.pushError(BladeError.makeSyntaxError(
                            BladeErrorCodes.TYPE_UNCLOSED_PHP_DIRECTIVE,
                            directive,
                            'Unclosed @php directive',
                            ErrrorLevel.Error
                        ));
                    }
                } else if (lowerName == 'endphp' && directive.isOpenedBy == null) {
                    directive.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNPAIRED_PHP_CLOSING_DIRECTIVE,
                        directive,
                        'Unpaired @endphp directive',
                        ErrrorLevel.Error
                    ));
                } else if (lowerName == 'verbatim' && directive.isClosedBy == null) {
                    directive.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNCLOSED_VERBATIM,
                        directive,
                        'Unclosed @verbatim directive',
                        ErrrorLevel.Error
                    ));
                } else if (lowerName == 'endverbatim' && directive.isOpenedBy == null) {
                    directive.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNPAIRED_VERBATIM_CLOSING_DIRECTIVE,
                        directive,
                        'Unpaired @endverbatim directive',
                        ErrrorLevel.Error
                    ));
                } else if (lowerName == 'for' && directive.isClosedBy == null) {
                    directive.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNCLOSED_FOR_DIRECTIVE,
                        directive,
                        'Unclosed @for directive',
                        ErrrorLevel.Error
                    ));
                } else if (lowerName == 'for' && directive.isClosingDirective == true && directive.isOpenedBy == null) {
                    directive.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNPAIRED_FOR_CLOSING_DIRECTIVE,
                        directive,
                        'Unpaired @endfor directive',
                        ErrrorLevel.Error
                    ));
                } else if (lowerName == 'forelse') {
                    if (directive.isClosedBy == null) {
                        directive.pushError(BladeError.makeSyntaxError(
                            BladeErrorCodes.TYPE_UNCLOSED_FOR_ELSE_DIRECTIVE,
                            directive,
                            'Unclosed @forelse directive',
                            ErrrorLevel.Error
                        ));
                    }

                    const emptyChild = directive.findFirstDirectChildDirectiveOfType('empty');

                    if (emptyChild == null) {
                        directive.pushError(BladeError.makeSyntaxError(
                            BladeErrorCodes.TYPE_FOR_ELSE_MISSING_EMPTY_DIRECTIVE,
                            directive,
                            '@forelse missing @empty directive',
                            ErrrorLevel.Warning
                        ));
                    }
                } else if (lowerName == 'endforelse' && directive.isOpenedBy == null) {
                    directive.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNPAIRED_FOR_ELSE_CLOSING_DIRECTIVE,
                        directive,
                        'Unpaired @endforelse directive',
                        ErrrorLevel.Error
                    ));
                }
            }
        });

        this.createChildDocuments(this.renderNodes);

        if (this.parseFragments && this.content.length > 0) {
            this.fragmentsParser
                .setIndexRanges(this.getNodeIndexRanges())
                .parse(FragmentsTransformer.transform(this.nodes, this.content));
        }

        this.fragmentsAnalyzer.analyze();

        this.renderNodes.forEach((node) => {
            if (node instanceof ConditionNode) {
                node.fragment = node.constructedFrom?.fragment ?? null;
                node.fragmentPosition = node.constructedFrom?.fragmentPosition ?? FragmentPosition.Unresolved;
            } else if (node instanceof ForElseNode) {
                node.fragment = node.constructedFrom?.fragment ?? null;
                node.fragmentPosition = node.constructedFrom?.fragmentPosition ?? FragmentPosition.Unresolved;
            } else if (node instanceof SwitchStatementNode) {
                node.fragment = node.constructedFrom?.fragment ?? null;
                node.fragmentPosition = node.constructedFrom?.fragmentPosition ?? FragmentPosition.Unresolved;
            }
        });

        DirectiveStack.setChildTypeCounts(this.nodes);

        return this.renderNodes;
    }

    private shiftIndexToWhitespace(index:number) {
        let newIndex = index;
        let char = this.content[newIndex];

        if (index > 0) {
            char = this.content[newIndex - 1];

            if (! StringUtilities.ctypeSpace(char) || char === "\n") {
                return index;
            }

            while (StringUtilities.ctypeSpace(char)) {
                newIndex -= 1;

                if (newIndex < 0) {
                    return 0;
                }

                char = this.content[newIndex];

                if (char === "\n") {
                    newIndex += 1;
                    break;
                }
            }

            if (newIndex != index) {
                // Prevent excessive scanning backward
                return index - 1;
            }

            return newIndex + 1;
        }

        return index;
    }

    getNodeIndexRanges() {
        const indexRanges: IndexRange[] = [];

        this.nodes.forEach((node) => {
            if ((node instanceof LiteralNode) == false) {
                indexRanges.push({
                    start: node.startPosition?.index ?? 0,
                    end: node.endPosition?.index ?? 0
                });
            }
        });

        return indexRanges;
    }

    private createChildDocuments(renderNodes: AbstractNode[]) {
        renderNodes.forEach((node) => {
            if (node instanceof DirectiveNode && node.isClosedBy != null) {
                const isClosedBy = node.isClosedBy as DirectiveNode,
                    docStart = (node.startPosition?.index ?? 0) - 1,
                    docLength = (isClosedBy.endPosition?.index ?? 0) - docStart;

                node.nodeContent = this.content.substr(docStart, docLength);

                const startOffset = (node.endPosition?.index ?? 0),
                    length = ((isClosedBy.startPosition?.index ?? 0) - 1) - startOffset,
                    childText = this.content.substr(startOffset, length);
                node.childrenDocument = BladeDocument.childFromText(childText, this, getStartPosition(node.getChildren()));
            }
        });
    }

    checkCurrentOffsets() {
        if (this.currentIndex > this.chars.length) {
            this.cur = null;
            this.prev = null;
            this.next = null;
            return;
        }

        // Fake the chunking behavior.
        const curChunk = Math.ceil(this.currentIndex / 5);

        if (curChunk > 0) {
            this.currentChunkOffset = this.parsingOffset + (this.chunkSize * curChunk);
        }

        this.cur = this.chars[this.currentIndex];

        this.prev = null;
        this.next = null;

        if (this.currentIndex > 0) {
            this.prev = this.chars[this.currentIndex - 1];
        }

        if ((this.currentIndex + 1) < this.inputLen) {
            if (this.currentIndex + 1 < this.chars.length) {
                this.next = this.chars[this.currentIndex + 1];
            }
        }
    }

    private parseIntermediateText(offset: number) {
        this.currentContent = [];

        this.chars = this.content.substring(offset).split('');
        this.charLen = this.chars.length;

        let parsedNode = false;

        for (this.currentIndex = 0; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.isStartingShorthandPhp()) {
                this.scanToEndOfPhp(this.currentIndex, true);
                this.currentIndex += 2;
                this.lastBladeEndIndex = this.currentIndex + this.seedOffset;
                this.currentContent = [];
                break;
            }

            if (this.isStartingPhp()) {
                this.scanToEndOfPhp(this.currentIndex);
                this.currentIndex += 2;
                this.lastBladeEndIndex = this.currentIndex + this.seedOffset;
                this.currentContent = [];
                break;
            }

            if (this.isStartingDirective()) {
                this.currentIndex += 1;
                this.scanToEndOfDirective();
                this.currentContent = [];
                this.currentIndex += 1;
                parsedNode = true;
                break;
            }

            if (this.isStartingClosingComponentTag()) {
                const componentTagStartedOn = this.currentIndex;

                this.currentIndex += 4;
                this.currentContent = [];
                this.checkCurrentOffsets();
                this.isParsingComponent = true;
                this.scanToEndOfComponentTag(componentTagStartedOn, true);
                this.isParsingComponent = false;
                this.currentIndex += 3;
                this.currentContent = [];
                parsedNode = true;
                break;
            }

            if (this.isStartingOpeningComponentTag()) {
                const componentTagStartedOn = this.currentIndex;

                this.currentIndex += 3;
                this.currentContent = [];
                this.checkCurrentOffsets();
                this.isParsingComponent = true;
                this.scanToEndOfComponentTag(componentTagStartedOn, false);
                this.isParsingComponent = false;
                this.currentContent = [];
                this.currentIndex += 3;
                parsedNode = true;
                break;
            }

            if (this.isStartingEscapedEcho()) {
                const escapedEchoStartedOn = this.currentIndex;

                this.currentIndex += 3;
                this.currentContent = [];
                this.checkCurrentOffsets();
                this.scanToEndOfEscapedEcho(escapedEchoStartedOn);
                this.currentContent = [];
                this.currentIndex += 3;
                parsedNode = true;
                break;
            }

            if (this.isStartingBladeNodeStructure()) {
                const peekOne = this.peek(2),
                    peekTwo = this.peek(3);

                // Check for comments.
                if (peekOne == DocumentParser.Punctuation_Minus && peekTwo == DocumentParser.Punctuation_Minus) {
                    const commentStartedOn = this.currentIndex;

                    this.currentIndex += 4;
                    this.currentContent = [];
                    this.checkCurrentOffsets();
                    this.scanToEndOfComment(commentStartedOn);
                    this.currentContent = [];
                    this.currentIndex += 4;
                    parsedNode = true;
                    break;
                } else {
                    if (peekOne == DocumentParser.LeftBrace) {
                        const echoStartedOn = this.currentIndex;

                        this.currentIndex += 3;
                        this.scanToEndOfBladeEntitiesEcho(echoStartedOn + 1);
                        this.currentContent = [];
                        this.currentIndex += 3;
                        parsedNode = true;
                        break;
                    } else {
                        const echoStartedOn = this.currentIndex;

                        this.currentIndex += 2;
                        this.scanToEndOfBladeEcho(echoStartedOn + 1);
                        this.currentContent = [];
                        this.currentIndex += 2;
                        parsedNode = true;
                        break;
                    }
                }
            }
        }

        return parsedNode;
    }

    private peek(count: number) {
        return this.chars[count];
    }

    private peekRelative(count: number) {
        return this.peek(this.currentIndex + count);
    }

    private scanToEndOfPhp(startedOn: number, isShorthand = false) {

        for (this.currentIndex; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (isStartOfString(this.cur)) {
                skipToEndOfString(this);
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_ForwardSlash) {
                this.shouldIgnoreStructures = true;
                skipToEndOfLine(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_Asterisk) {
                this.shouldIgnoreStructures = true;
                skipToEndOfMultilineComment(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if ((this.cur == DocumentParser.Punctuation_QuestionMark && this.next == DocumentParser.Punctuation_GreaterThan) || this.next == null) {
                let inlinePhp = new InlinePhpNode();
                this.hasPhpContent = true;

                if (isShorthand) {
                    inlinePhp = new ShorthandInlinePhpNode();
                }

                inlinePhp.withParser(this);
                inlinePhp.startPosition = this.positionFromOffset(startedOn + this.seedOffset, startedOn + this.seedOffset);
                inlinePhp.endPosition = this.positionFromOffset(this.currentIndex + 1 + this.seedOffset, this.currentIndex + 1 + this.seedOffset);

                const startOffset = inlinePhp.startPosition.index,
                    length = (inlinePhp.endPosition.index - inlinePhp.startPosition.index) + 1;
                inlinePhp.sourceContent = this.content.substr(startOffset, length);

                this.nodes.push(inlinePhp);
                this.lastNode = inlinePhp;
                break;
            }
        }
    }

    private scanToEndOfComponentTag(startedOn: number, isClosing: boolean) {
        let hasObservedNewLine = false,
            hasObservedSpace = false,
            newlineRecoveryIndex = -1,
            spaceRecoveryIndex = -1,
            createErrorNode = false;

        for (this.currentIndex; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == DocumentParser.NewLine && !hasObservedNewLine) {
                hasObservedNewLine = true;
                newlineRecoveryIndex = this.currentIndex;
            }

            if (StringUtilities.ctypeSpace(this.cur) && !hasObservedSpace) {
                hasObservedSpace = true;
                spaceRecoveryIndex = this.currentIndex;
            }

            if (isStartOfString(this.cur)) {
                this.shouldIgnoreStructures = true;
                skipToEndOfString(this);
                this.shouldIgnoreStructures = false;
                continue;
            }

            const isClosingComponent = this.isClosingComponent();

            if (this.hasEncounteredAnotherStructure() || (this.next == null && !isClosingComponent)) {
                createErrorNode = true;
                if (newlineRecoveryIndex != -1) {
                    this.currentIndex = newlineRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, newlineRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                } else if (spaceRecoveryIndex != -1) {
                    this.currentIndex = spaceRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, spaceRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                }
            }

            if (isClosingComponent || createErrorNode) {
                const tagComponent = new BladeComponentNode();
                this.hasComponents = true;
                tagComponent.withParser(this);
                tagComponent.startPosition = this.positionFromOffset(startedOn + this.seedOffset, startedOn + this.seedOffset);
                tagComponent.endPosition = this.positionFromOffset(this.currentIndex + this.seedOffset, this.currentIndex + this.seedOffset);
                const startOffset = tagComponent.startPosition.index,
                    length = (tagComponent.endPosition.index - tagComponent.startPosition.index) + 1,
                    endOffset = startOffset + length;
                tagComponent.sourceContent = this.content.substr(startOffset, length);
                tagComponent.isClosingTag = isClosing;
                tagComponent.isSelfClosing = this.prev == DocumentParser.Punctuation_ForwardSlash;
                tagComponent.offset = {
                    start: startOffset,
                    end: endOffset,
                    length: length
                };

                let shiftRight = 3;

                if (tagComponent.isSelfClosing) { shiftRight += 1; }

                tagComponent.innerContent = this.content.substr(tagComponent.startPosition.index + 3, (tagComponent.endPosition.index - tagComponent.startPosition.index) - shiftRight);

                if (createErrorNode) {
                    tagComponent.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNEXPECTED_END_OF_INPUT,
                        tagComponent,
                        'Unexpected end of input while parsing component tag',
                        ErrrorLevel.Error
                    ));
                }

                this.componentParser.parse(tagComponent);

                this.currentContent = [];
                this.lastBladeEndIndex = this.currentIndex + this.seedOffset;
                this.lastNode = tagComponent;
                this.nodes.push(tagComponent);
                break;
            }
        }
    }

    private scanToEndOfEscapedEcho(startedOn: number) {
        let hasObservedNewLine = false,
            hasObservedSpace = false,
            newlineRecoveryIndex = -1,
            spaceRecoveryIndex = -1,
            createErrorNode = false;

        for (this.currentIndex; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == DocumentParser.NewLine && !hasObservedNewLine) {
                hasObservedNewLine = true;
                newlineRecoveryIndex = this.currentIndex;
            }

            if (StringUtilities.ctypeSpace(this.cur) && !hasObservedSpace) {
                hasObservedSpace = true;
                spaceRecoveryIndex = this.currentIndex;
            }

            if (isStartOfString(this.cur)) {
                const stringStart = this.cur as string;
                this.shouldIgnoreStructures = true;
                const results = skipToEndOfStringTraced(this);
                this.shouldIgnoreStructures = false;
                this.currentIndex = results.endedOn;
                this.currentContent.push(stringStart);
                this.currentContent = this.currentContent.concat(results.value.split(''));
                this.currentContent.push(stringStart);
                this.currentIndex = results.endedOn;
                continue;
            }

            // Ignore PHP comments.
            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_ForwardSlash) {
                this.shouldIgnoreStructures = true;
                skipToEndOfLine(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_Asterisk) {
                this.shouldIgnoreStructures = true;
                skipToEndOfMultilineComment(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.hasEncounteredAnotherStructure() || this.next == null) {
                createErrorNode = true;
                if (newlineRecoveryIndex != -1) {
                    this.currentIndex = newlineRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, newlineRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                } else if (spaceRecoveryIndex != -1) {
                    this.currentIndex = spaceRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, spaceRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                }
            }

            // Check for !!}
            if ((this.cur == DocumentParser.Punctuation_Exclamation && this.next == DocumentParser.Punctuation_Exclamation && this.peekRelative(2) == DocumentParser.RightBrace) || createErrorNode) {
                const echoEnd = this.currentIndex + 2;

                const echoNode = new BladeEscapedEchoNode();
                echoNode.startPosition = this.positionFromOffset(startedOn + this.seedOffset, startedOn + this.seedOffset);
                echoNode.endPosition = this.positionFromOffset(echoEnd + this.seedOffset, echoEnd + this.seedOffset);
                echoNode.withParser(this);

                const startOffset = echoNode.startPosition.index,
                    length = (echoNode.endPosition.index - echoNode.startPosition.index) + 1,
                    endOffset = startOffset + length;

                echoNode.sourceContent = this.content.substr(startOffset, length);
                echoNode.offset = {
                    start: startOffset,
                    end: endOffset,
                    length: length
                };

                if (createErrorNode) {
                    echoNode.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNEXPECTED_END_OF_INPUT,
                        echoNode,
                        'Unexpected end of input while parsing echo',
                        ErrrorLevel.Error
                    ));
                }

                echoNode.content = this.currentContent.join('');
                this.currentContent = [];
                this.lastBladeEndIndex = this.currentIndex + 2 + this.seedOffset;
                this.lastNode = echoNode;
                this.nodes.push(echoNode);
                break;
            }

            if (this.cur == null) { break; }
            this.currentContent.push(this.cur);
        }
    }

    private scanToEndOfComment(startedOn: number) {
        let hasObservedNewLine = false,
            hasObservedSpace = false,
            newlineRecoveryIndex = -1,
            spaceRecoveryIndex = -1,
            createErrorNode = false;

        for (this.currentIndex; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == DocumentParser.NewLine && !hasObservedNewLine) {
                hasObservedNewLine = true;
                newlineRecoveryIndex = this.currentIndex;
            }

            if (StringUtilities.ctypeSpace(this.cur) && !hasObservedSpace) {
                hasObservedSpace = true;
                spaceRecoveryIndex = this.currentIndex;
            }

            if (this.next == null) {
                createErrorNode = true;
                if (newlineRecoveryIndex != -1) {
                    this.currentIndex = newlineRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, newlineRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                } else if (spaceRecoveryIndex != -1) {
                    this.currentIndex = spaceRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, spaceRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                }
            }

            if ((this.cur == DocumentParser.Punctuation_Minus && this.next == DocumentParser.Punctuation_Minus) || this.next == null) {
                const peekOne = this.peekRelative(2),
                    peekTwo = this.peekRelative(3);

                if ((peekOne == DocumentParser.RightBrace && peekTwo == DocumentParser.RightBrace) || this.next == null) {
                    const commentEnd = this.currentIndex + 3;

                    const comment = new BladeCommentNode();
                    comment.startPosition = this.positionFromOffset(startedOn + this.seedOffset, startedOn + this.seedOffset);
                    comment.endPosition = this.positionFromOffset(commentEnd + this.seedOffset, commentEnd + this.seedOffset);

                    comment.innerContentPosition = {
                        start: this.positionFromOffset(startedOn + 4 + this.seedOffset, startedOn + 4 + this.seedOffset),
                        end: this.positionFromOffset(commentEnd - 4 + this.seedOffset, commentEnd - 4 + this.seedOffset)
                    };

                    comment.withParser(this);

                    const startOffset = comment.startPosition.index,
                        length = (comment.endPosition.index - comment.startPosition.index) + 1,
                        endOffset = startOffset + length;

                    comment.sourceContent = this.content.substr(startOffset, length);
                    comment.offset = {
                        start: startOffset,
                        end: endOffset,
                        length: length
                    };

                    if (createErrorNode) {
                        comment.pushError(BladeError.makeSyntaxError(
                            BladeErrorCodes.TYPE_UNCLOSED_COMMENT,
                            comment,
                            'Unexpected end of input while parsing comment',
                            ErrrorLevel.Error
                        ));
                    }

                    comment.innerContent = this.content.substr((comment.innerContentPosition?.start?.index ?? 0), ((comment.innerContentPosition?.end?.index ?? 0) - (comment.innerContentPosition?.start?.index ?? 0)) + 1);
                    this.currentContent = [];
                    this.lastBladeEndIndex = this.currentIndex + 3 + this.seedOffset;
                    this.lastNode = comment;
                    this.nodes.push(comment);
                    break;
                } else {
                    if (this.cur != null) {
                        this.currentContent.push(this.cur);
                    }
                    continue;
                }
            }

            if (this.cur == null) { break; }
            this.currentContent.push(this.cur);
        }
    }

    private scanToEndOfBladeEntitiesEcho(startedOn: number) {
        let hasObservedNewLine = false,
            hasObservedSpace = false,
            newlineRecoveryIndex = -1,
            spaceRecoveryIndex = -1,
            createErrorNode = false;

        for (this.currentIndex; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == DocumentParser.NewLine && !hasObservedNewLine) {
                hasObservedNewLine = true;
                newlineRecoveryIndex = this.currentIndex;
            }

            if (StringUtilities.ctypeSpace(this.cur) && !hasObservedSpace) {
                hasObservedSpace = true;
                spaceRecoveryIndex = this.currentIndex;
            }

            if (isStartOfString(this.cur)) {
                const stringStart = this.cur as string;
                this.shouldIgnoreStructures = true;
                const results = skipToEndOfStringTraced(this);
                this.shouldIgnoreStructures = false;
                this.currentIndex = results.endedOn;
                this.currentContent.push(stringStart);
                this.currentContent = this.currentContent.concat(results.value.split(''));
                this.currentContent.push(stringStart);
                this.currentIndex = results.endedOn;
                continue;
            }

            // Ignore PHP comments.
            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_ForwardSlash) {
                this.shouldIgnoreStructures = true;
                skipToEndOfLine(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_Asterisk) {
                this.shouldIgnoreStructures = true;
                skipToEndOfMultilineComment(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.hasEncounteredAnotherStructure() || this.next == null) {
                createErrorNode = true;
                if (newlineRecoveryIndex != -1) {
                    this.currentIndex = newlineRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, newlineRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                } else if (spaceRecoveryIndex != -1) {
                    this.currentIndex = spaceRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, spaceRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                }
            }

            if ((this.cur == DocumentParser.RightBrace && this.next == DocumentParser.RightBrace && this.peekRelative(2) == DocumentParser.RightBrace) || createErrorNode) {
                const echoEnd = this.currentIndex + 1;

                const echoNode = new BladeEntitiesEchoNode();
                echoNode.startPosition = this.positionFromOffset(startedOn + this.seedOffset, startedOn + this.seedOffset);
                echoNode.endPosition = this.positionFromOffset(echoEnd + this.seedOffset, echoEnd + this.seedOffset);
                echoNode.withParser(this);

                const startOffset = echoNode.startPosition.index - 1,
                    length = (echoNode.endPosition.index - echoNode.startPosition.index) + 3,
                    endOffset = startOffset + length;

                echoNode.sourceContent = this.content.substr(startOffset, length);
                echoNode.offset = {
                    start: startOffset,
                    end: endOffset,
                    length: length
                };

                if (createErrorNode) {
                    echoNode.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNEXPECTED_END_OF_INPUT,
                        echoNode,
                        'Unexpected end of input while parsing echo',
                        ErrrorLevel.Error
                    ));
                }

                echoNode.content = this.currentContent.join('');
                this.currentContent = [];
                this.lastBladeEndIndex = this.currentIndex + 2 + this.seedOffset;
                this.lastNode = echoNode;
                this.nodes.push(echoNode);
                break;
            }

            if (this.cur == null) { break; }
            this.currentContent.push(this.cur);
        }
    }

    private scanToEndOfBladeEcho(startedOn: number) {
        let hasObservedNewLine = false,
            hasObservedSpace = false,
            newlineRecoveryIndex = -1,
            spaceRecoveryIndex = -1,
            createErrorNode = false;

        for (this.currentIndex; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == DocumentParser.NewLine && !hasObservedNewLine) {
                hasObservedNewLine = true;
                newlineRecoveryIndex = this.currentIndex;
            }

            if (StringUtilities.ctypeSpace(this.cur) && !hasObservedSpace) {
                hasObservedSpace = true;
                spaceRecoveryIndex = this.currentIndex;
            }

            if (isStartOfString(this.cur)) {
                const stringStart = this.cur as string;
                this.shouldIgnoreStructures = true;
                const results = skipToEndOfStringTraced(this);
                this.shouldIgnoreStructures = false;
                this.currentIndex = results.endedOn;
                this.currentContent.push(stringStart);
                this.currentContent = this.currentContent.concat(results.value.split(''));
                this.currentContent.push(stringStart);
                this.currentIndex = results.endedOn;
                continue;
            }


            // Ignore PHP comments.
            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_ForwardSlash) {
                this.shouldIgnoreStructures = true;
                skipToEndOfLine(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_Asterisk) {
                this.shouldIgnoreStructures = true;
                skipToEndOfMultilineComment(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.hasEncounteredAnotherStructure() || this.next == null) {
                createErrorNode = true;
                if (newlineRecoveryIndex != -1) {
                    this.currentIndex = newlineRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, newlineRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                } else if (spaceRecoveryIndex != -1) {
                    this.currentIndex = spaceRecoveryIndex - 2;
                    this.currentContent = this.currentContent.slice(0, spaceRecoveryIndex - 2);
                    this.didRecoveryLogic = true;
                }
            }

            if ((this.cur == DocumentParser.RightBrace && this.next == DocumentParser.RightBrace) || createErrorNode) {
                const echoEnd = this.currentIndex + 1;

                const echoNode = new BladeEchoNode();
                echoNode.startPosition = this.positionFromOffset(startedOn + this.seedOffset, startedOn + this.seedOffset);
                echoNode.endPosition = this.positionFromOffset(echoEnd + this.seedOffset, echoEnd + this.seedOffset);
                echoNode.withParser(this);

                const startOffset = echoNode.startPosition.index - 1,
                    length = (echoNode.endPosition.index - echoNode.startPosition.index) + 2,
                    endOffset = startOffset + length;

                echoNode.sourceContent = this.content.substr(startOffset, length);
                echoNode.offset = {
                    start: startOffset,
                    end: endOffset,
                    length: length
                };

                if (createErrorNode) {
                    echoNode.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_UNEXPECTED_END_OF_INPUT,
                        echoNode,
                        'Unexpected end of input while parsing echo',
                        ErrrorLevel.Error
                    ));
                }

                echoNode.content = this.currentContent.join('');
                this.currentContent = [];
                this.lastBladeEndIndex = this.currentIndex + 1 + this.seedOffset;
                this.lastNode = echoNode;
                this.nodes.push(echoNode);
                break;
            }

            if (this.cur == null) { break; }
            this.currentContent.push(this.cur);
        }
    }

    private makeDirective(name: string, nameStartsOn: number, nameEndsOn: number) {
        const directive = new DirectiveNode();
        directive.withParser(this);

        if (name == BladeKeywords.Verbatim) {
            this.isVerbatim = true;
        } else if (name == BladeKeywords.Php) {
            this.isPhpNode = true;
        } else if (name == BladeKeywords.EndVerbatim || name == BladeKeywords.EndPhp) {
            const lastNode = this.nodes[this.nodes.length - 1];
            if (lastNode instanceof LiteralNode) {
                const literal = this.nodes.pop() as LiteralNode;

                if (this.nodes[this.nodes.length - 1] instanceof DirectiveNode) {
                    const openNode = this.nodes[this.nodes.length - 1] as DirectiveNode;

                    if (openNode.directiveName == BladeKeywords.Verbatim || openNode.directiveName == BladeKeywords.Php) {
                        openNode.innerContent = literal.content;
                    }
                }
            }
        }

        directive.directiveName = name.trim();
        directive.name = name.trim();

        const lowerName = directive.name.toLowerCase();

        if (lowerName == 'endcan' || lowerName == 'endcannot' || lowerName == 'endauth' || lowerName == 'endguest' || lowerName == 'endenv' || lowerName == 'endproduction' || lowerName == 'endif') {
            directive.name = 'if';
            directive.isClosingDirective = true;
        } else if (name.startsWith('end')) {
            directive.name = name.substring(3);
        } else if (name.startsWith('else') && name != 'elseif' && name != 'else') {
            directive.name = 'elseif';
        }

        const nameStartPosition = this.positionFromOffset(this.seedOffset + nameStartsOn, this.seedOffset + nameStartsOn),
            nameEndPosition = this.positionFromOffset(this.seedOffset + nameEndsOn, this.seedOffset + nameEndsOn);

        directive.startPosition = nameStartPosition;
        directive.endPosition = nameEndPosition;

        directive.namePosition = {
            start: nameStartPosition,
            end: nameEndPosition
        };

        directive.hasDirectiveParameters = false;

        if (directive.startPosition != null && directive.endPosition != null) {
            const startOffset = directive.startPosition.index - 1,
                length = (directive.endPosition.index - directive.startPosition.index) + 1,
                endOffset = startOffset + length;

            directive.sourceContent = this.content.substr(startOffset, length);
            directive.offset = {
                start: startOffset,
                end: endOffset,
                length: length
            };
        }

        return directive;
    }

    private makeDirectiveWithParameters(name: string, nameStartsOn: number, nameEndsOn: number, params: LogicGroupScanResults): DirectiveNode {
        const directive = this.makeDirective(name.trim(), nameStartsOn, nameEndsOn);

        if (this.isPhpNode && name == BladeKeywords.Php) {
            this.isPhpNode = false;
        }

        directive.hasDirectiveParameters = true;
        directive.directiveParameters = params.content;

        // Check to see if the directive probably contains JSON params.
        let checkParams = params.content.trim();

        if (checkParams.startsWith('(') && checkParams.endsWith(')')) {
            checkParams = checkParams.substring(1);
            checkParams = checkParams.substring(0, checkParams.length - 1);
            checkParams = checkParams.trim();

            directive.hasJsonParameters = checkParams.startsWith('{') && checkParams.endsWith('}');
        }

        const directiveParamtersStartPosition = this.positionFromOffset(params.start, params.start),
            directiveParametersEndPosition = this.positionFromOffset(params.end, params.end);

        directive.startPosition = directive.namePosition?.start ?? null;
        directive.endPosition = directiveParametersEndPosition;

        directive.directiveParametersPosition = {
            start: directiveParamtersStartPosition,
            end: directiveParametersEndPosition
        };

        if (directive.startPosition != null && directive.endPosition != null) {
            const startOffset = directive.startPosition.index - 1,
                length = (directive.endPosition.index - directive.startPosition.index) + 1,
                endOffset = startOffset + length;

            directive.sourceContent = this.content.substr(startOffset, length);
            directive.offset = {
                start: startOffset,
                end: endOffset,
                length: length
            };
        }

        return directive;
    }

    private scanToEndOfDirective() {
        const directiveNameStartsOn = this.currentIndex;
        let directiveName = '',
            directiveNameEndsOn = 0;

        for (this.currentIndex; this.currentIndex < this.inputLen; this.currentIndex += 1) {
            this.checkCurrentOffsets();

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_Asterisk) {
                this.shouldIgnoreStructures = true;
                skipToEndOfMultilineComment(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.cur == DocumentParser.Punctuation_ForwardSlash && this.next == DocumentParser.Punctuation_ForwardSlash) {
                this.shouldIgnoreStructures = true;
                skipToEndOfLine(this, true);
                this.shouldIgnoreStructures = false;
                continue;
            }

            if (this.cur == DocumentParser.NewLine) {
                directiveNameEndsOn = this.currentIndex;
                directiveName = this.currentContent.join('');
                this.currentContent = [];
                const directive = this.makeDirective(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn);

                this.lastNode = directive;
                this.nodes.push(directive);
                this.lastBladeEndIndex = this.currentIndex + this.seedOffset - 1;

                break;
            } else if (this.next == null) {
                this.currentContent.push(this.cur as string);
                directiveNameEndsOn = this.currentIndex + 1;
                directiveName = this.currentContent.join('');
                this.currentContent = [];
                const directive = this.makeDirective(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn);

                this.lastNode = directive;
                this.nodes.push(directive);
                this.lastBladeEndIndex = this.currentIndex + this.seedOffset;

                break;
            }

            const nextNonWs = nextNonWhitespace(this);

            if (this.cur != DocumentParser.LeftParen && nextNonWs.didFind && StringUtilities.ctypePunct(nextNonWs.char)) {
                if (nextNonWs.char != DocumentParser.LeftParen && nextNonWs.char != DocumentParser.Punctuation_Minus && nextNonWs.char != '.' && nextNonWs.char != '_') {
                    let endOffset = 0,
                        brokeOnWhiteSpace = false;

                    if (!StringUtilities.ctypeSpace(this.cur)) {
                        this.currentContent.push(this.cur as string);
                    } else {
                        endOffset = 1;
                        brokeOnWhiteSpace = true;
                    }

                    directiveNameEndsOn = this.currentIndex + 1;
                    directiveName = this.currentContent.join('');
                    this.currentContent = [];
                    const directive = this.makeDirective(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn - endOffset);

                    this.lastNode = directive;
                    this.nodes.push(directive);
                    this.lastBladeEndIndex = this.currentIndex + this.seedOffset - endOffset;

                    if (brokeOnWhiteSpace) {
                        this.currentIndex -= 1;
                    }

                    break;
                }
            }

            if (StringUtilities.ctypeSpace(this.cur)) {
                const nextNonWs = nextNonWhitespace(this);

                if (nextNonWs.didFind && nextNonWs.char == DocumentParser.LeftParen) {
                    directiveNameEndsOn = this.currentIndex - 1;
                    directiveName = this.currentContent.join('');
                    this.currentContent = [];
                    this.currentIndex = (nextNonWs.index as number);
                    this.checkCurrentOffsets();
                    const logicGroupResults = scanToEndOfLogicGroup(this);

                    let directive: DirectiveNode;

                    if (logicGroupResults.foundEnd) {
                        directive = this.makeDirectiveWithParameters(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn, logicGroupResults);
                    } else {
                        directive = this.makeDirective(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn);
                        this.didRecoveryLogic = true;
                    }

                    this.lastNode = directive;
                    this.nodes.push(directive);
                    this.lastBladeEndIndex = this.currentIndex + this.seedOffset;

                    break;
                } else {
                    directiveNameEndsOn = this.currentIndex;
                    directiveName = this.currentContent.join('');
                    this.currentContent = [];
                    const directive = this.makeDirective(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn);

                    this.lastNode = directive;
                    this.nodes.push(directive);
                    this.lastBladeEndIndex = this.currentIndex + this.seedOffset;

                    break;
                }
            } else if (this.cur == DocumentParser.LeftParen) {
                directiveNameEndsOn = this.currentIndex - 1;
                directiveName = this.currentContent.join('');
                this.currentContent = [];
                const logicGroupResults = scanToEndOfLogicGroup(this);
                let directive: DirectiveNode;

                if (logicGroupResults.foundEnd) {
                    directive = this.makeDirectiveWithParameters(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn, logicGroupResults)
                } else {
                    directive = this.makeDirective(directiveName.trim(), directiveNameStartsOn, directiveNameEndsOn + 1);
                }

                this.lastNode = directive;
                this.nodes.push(directive);
                this.lastBladeEndIndex = this.currentIndex + this.seedOffset;
                break;
            }

            if (this.cur == null) { break; }
            this.currentContent.push(this.cur);
        }
    }

    getText(start: number, end: number) {
        return this.content.substr(start, (end - start));
    }

    getNodeText(nodes: AbstractNode[]): string {
        let text = '';

        nodes.forEach((node) => {
            if (node instanceof LiteralNode) {
                text += node.content;
            } else {
                if (node instanceof ForElseNode) {
                    text += node.nodeContent;
                } else if (node instanceof SwitchStatementNode) {
                    text += node.nodeContent;
                } else if (node instanceof ConditionNode) {
                    text += node.nodeContent;
                } else if (node instanceof DirectiveNode) {
                    if ((node.name == 'php' || node.name == 'verbatim') && node.isClosedBy != null) {
                        if (node.documentContent.trim().length == 0) {
                            const content = node.getParser()?.getText(
                                (node.endPosition?.index ?? 0),
                                (node.isClosedBy.startPosition?.index ?? 0) - 1
                            );
                            text += node.sourceContent;
                            text += content;
                        }
                    } else {
                        text += node.sourceContent;
                    }
                } else {
                    text += node.sourceContent;
                }
            }
        });

        return text;
    }

    getNodes(): AbstractNode[] {
        return this.nodes;
    }

    getNodesBetween(start: Position, end: Position): AbstractNode[] {
        const returnNodes: AbstractNode[] = [];

        this.nodes.forEach((node) => {
            if ((node.startPosition?.offset ?? 0) > start.offset && (node.endPosition?.offset ?? 0) < end.offset) {
                returnNodes.push(node);
            }
        });

        return returnNodes;
    }

    getRenderNodes(): AbstractNode[] {
        return this.renderNodes;
    }

    private prepareLiteralContent(content: string) {
        return content;
    }

    positionFromOffset(offset: number, index: number, isRelativeOffset = false) {
        let lineToUse = 0,
            charToUse = 0;

        if (!this.documentOffsets.has(offset)) {
            if (this.documentOffsets.size == 0) {
                lineToUse = 1;
                charToUse = offset + 1;
            } else {
                let nearestOffset: DocumentOffset | null = null,
                    nearestOffsetIndex: number | null = null,
                    lastOffset: DocumentOffset | null = null,
                    lastOffsetIndex: number | null = null;

                for (const documentOffset of this.documentOffsets.keys()) {
                    if (documentOffset >= offset) {
                        if (lastOffsetIndex != null && offset > lastOffsetIndex) {
                            nearestOffset = lastOffset;
                            nearestOffsetIndex = lastOffsetIndex;
                        } else {
                            nearestOffset = this.documentOffsets.get(documentOffset) as DocumentOffset;
                            nearestOffsetIndex = documentOffset;
                        }
                        break;
                    }
                    lastOffset = this.documentOffsets.get(documentOffset) as DocumentOffset;
                    lastOffsetIndex = documentOffset;
                }

                if (nearestOffset == null) {
                    nearestOffset = lastOffset;
                    nearestOffsetIndex = lastOffsetIndex;
                }

                if (nearestOffset != null) {
                    if (isRelativeOffset) {
                        const tChar = offset - (nearestOffsetIndex ?? 0);

                        charToUse = tChar;
                        lineToUse = nearestOffset.line;

                        if (offset <= (nearestOffsetIndex ?? 0)) {
                            lineToUse = nearestOffset.line;
                            charToUse = offset + 1;
                        } else {
                            lineToUse = nearestOffset.line + 1;
                        }
                    } else {
                        const tChar = offset - (nearestOffsetIndex ?? 0);
                        charToUse = tChar;
                        lineToUse = nearestOffset.line;

                        if (offset <= (nearestOffsetIndex ?? 0)) {
                            lineToUse = nearestOffset.line;
                            charToUse = offset + 1;
                        } else {
                            lineToUse = nearestOffset.line + 1;
                        }
                    }
                } else {
                    if (this.lastDocumentOffsetKey != null) {
                        const lastOffset = this.documentOffsets.get(this.lastDocumentOffsetKey) as DocumentOffset;
                        lineToUse = lastOffset.line + 1;
                        charToUse = offset + this.lastDocumentOffsetKey;
                    }
                }
            }
        } else {
            const offsetDetails = this.documentOffsets.get(offset) as DocumentOffset;

            lineToUse = offsetDetails.line;
            charToUse = offsetDetails.char;
        }

        const position = new Position();

        position.index = index;
        position.offset = offset;
        position.line = lineToUse + this.shiftLine;
        position.char = charToUse;

        return position;
    }
}
