import { ParserOptions } from "prettier";

export interface TransformOptions {
    spacesAfterDirective: number,
    spacesAfterControlDirective: number,
    tabSize: number,
    formatDirectivePhpParameters: boolean,
    formatDirectiveJsonParameters: boolean,
    formatInsideEcho: boolean,
    phpOptions: any|undefined
}