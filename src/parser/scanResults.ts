
export interface SeekResults {
    didFind: boolean,
    index: number | null,
    char: string
}

export interface LogicGroupScanResults {
    start: number,
    end: number,
    content: string
}
