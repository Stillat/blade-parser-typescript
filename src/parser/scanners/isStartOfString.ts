export function isStartOfString(char: string | null): boolean {
    if (char == null) { return false; }

    if (char == '"' || char == "'" || char == '`') {
        return true;
    }

    return false;
}