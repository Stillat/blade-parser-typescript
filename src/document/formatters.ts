import { ParserOptions } from 'prettier';
import { BladeDocument } from './bladeDocument.js';
import { TransformOptions } from './transformOptions.js';

export type PhpFormatter = (input: string, transformOptions:TransformOptions, options: ParserOptions|null) => Promise<string>;
export type BlockPhpFormatter = (input: string, transformOptions:TransformOptions, options: ParserOptions|null) => Promise<string>;
export type PhpTagFormatter = (input: string, transformOptions:TransformOptions, options: ParserOptions|null) => Promise<string>;
export type JsonFormatter = (input: string) => Promise<string>;
export type HtmlFormatter = (input: string) => Promise<string>;
export type PreFormatter = (document: BladeDocument) => string|null;