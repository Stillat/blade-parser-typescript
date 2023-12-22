import { IClassStringConfiguration } from '../formatting/classStringsConfig.js';

export interface TransformOptions {
    spacesAfterDirective: number,
    spacesAfterControlDirective: number,
    tabSize: number,
    formatDirectivePhpParameters: boolean,
    formatDirectiveJsonParameters: boolean,
    formatInsideEcho: boolean,
    phpOptions: any | undefined,
    attributeJsOptions: any | null | undefined,
    echoStyle: string,
    useLaravelPint: boolean,
    pintCommand: string,
    pintTempDirectory: string,
    pintCacheDirectory: string,
    pintCacheEnabled: boolean,
    pintConfigPath: string,
    classStrings: IClassStringConfiguration,
    formatJsAttributes: boolean,
    safeWrappingJsAttributes: string[],
    includeJsAttributes: string[],
    excludeJsAttributes: string[],
}