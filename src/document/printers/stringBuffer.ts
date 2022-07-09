export class StringBuffer {
    private tabSize = 0;
    private content = '';
    private activeIndentLevel = 0;

    constructor(tabSize: number, activeLevel: number) {
        this.tabSize = tabSize;
        this.activeIndentLevel = activeLevel;
    }

    appendNoRepeat(text: string) {
        if (this.content.trimEnd().endsWith(text) == false) {
            return this.append(text);
        }

        return this;
    }

    append(text: string) {
        this.content += text;
        return this;
    }

    getContents() {
        return this.content;
    }

    newLine() {
        this.content += "\n";
        return this;
    }

    indent() {
        this.content += ' '.repeat(this.tabSize * this.activeIndentLevel);

        return this;
    }

    outdent() {
        let target = this.activeIndentLevel - 1;

        if (target < 1) {
            target = 1;
        }

        this.content += ' '.repeat(this.tabSize * target);

        return this;
    }
}