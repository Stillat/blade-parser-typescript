import { BladeDocument } from './bladeDocument';

export type PhpFormatter = (input: string) => string;
export type BlockPhpFormatter = (input: string) => string;
export type PhpTagFormatter = (input: string) => string;
export type JsonFormatter = (input: string) => string;
export type HtmlFormatter = (input: string) => string;
export type PreFormatter = (document: BladeDocument) => string | null;