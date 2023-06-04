import { IClassStringConfiguration } from '../formatting/classStringsConfig';

export interface TransformOptions {
    spacesAfterDirective: number,
    spacesAfterControlDirective: number,
    tabSize: number,
    formatDirectivePhpParameters: boolean,
    formatDirectiveJsonParameters: boolean,
    formatInsideEcho: boolean,
    phpOptions: any | undefined,
    echoStyle: string,
    useLaravelPint: boolean,
    pintCommand: string,
    pintTempDirectory: string,
    pintCacheDirectory: string,
    pintCacheEnabled: boolean,
    pintConfigPath: string,
    classStrings: IClassStringConfiguration
}