export class DocumentPadder {
    static pad(content: string, line: number, char: number) {
        let text = '';

        for (let i = 0; i < line - 1; i++) {
            text += "\n";
        }

        text += ' '.repeat(char);

        text += content;

        return text;
    }
}