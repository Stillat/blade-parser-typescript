export interface IExtractedAttribute {
    name: string,
    content: string,
    startedOn: number,
    endedOn: number,
}

export interface ITransformedExtractedAttribute extends IExtractedAttribute {
    transformedContent: string
}