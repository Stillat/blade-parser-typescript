import { ParserOptions } from 'prettier';
import { BladeDocument } from './bladeDocument';
import { TransformOptions } from './transformOptions';

export type PhpFormatter = (input: string, transformOptions:TransformOptions, options: ParserOptions|null) => string;
export type BlockPhpFormatter = (input: string, transformOptions:TransformOptions, options: ParserOptions|null) => string;
export type PhpTagFormatter = (input: string, transformOptions:TransformOptions, options: ParserOptions|null) => string;
export type JsonFormatter = (input: string) => string;
export type HtmlFormatter = (input: string) => string;
export type PreFormatter = (document: BladeDocument) => string | null;