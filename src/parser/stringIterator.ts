export interface StringIterator {
    updateIndex(index: number): void,
    inputLength(): number,
    getCurrentIndex(): number,
    incrementIndex(): void,
    getCurrent(): string | null,
    getNext(): string | null,
    getPrev(): string | null,
    checkCurrentOffsets(): void,
    pushChar(value: string): void
    getChar(index: number): string;
    getSeedOffset(): number;
    getContentSubstring(from: number, length: number): string;
}