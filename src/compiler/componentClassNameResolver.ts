export interface ComponentClassNameResolver {
    resolveName(name: string): string,
}

export class AppClassNameResolver implements ComponentClassNameResolver {
    private namespace = `App\\View\\Components\\`;

    setNamespace(namespace: string) {
        this.namespace = namespace;
    }

    resolveName(name: string): string {
        let className = name;

        if (name.endsWith('::class')) {
            className = className.substring(0, className.length - 7);
        }

        return `${this.namespace}${className}`;
    }
}