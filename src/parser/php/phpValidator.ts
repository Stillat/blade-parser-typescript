export interface PhpValidator {
    isValid(template: string, isEval: boolean): boolean,
    getLastError(): SyntaxError | null,
}
