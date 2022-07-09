export interface ComponentDetails {
    properties: string[]
}

export interface ComponentDetailsResolver {
    getDetails(componentName: string): ComponentDetails | null
}