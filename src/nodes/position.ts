export class Position {
    public index = -1;
    public offset = 0;
    public line = 0;
    public char = 0;

    shiftRight(shiftOffset: number): Position {
        const position = new Position();
        position.offset = this.offset + shiftOffset;
        position.index = this.index + shiftOffset;
        position.line = this.line;
        position.char = this.char + shiftOffset;

        return position;
    }

    isBefore(position: Position | null): boolean {
        if (position == null) {
            return false;
        }

        if (position.line > this.line) {
            return true;
        }

        if (position.line == this.line && this.offset < position.offset) {
            return true;
        }

        return false;
    }

    isWithin(start: Position | null, end: Position | null, shiftEnd = 0) {
        if (start == null || end == null) {
            return false;
        }

        if (this.index >= start.index && this.index <= (end.index + shiftEnd)) {
            return true;
        }

        return false;
    }

    isWithinRange(range: Range | null) {
        if (range == null) {
            return false;
        }

        if (range.start != null && range.end != null) {
            return this.isWithin(range.start, range.end);
        }

        return false;
    }
}

export interface Range {
    start: Position | null,
    end: Position | null
}
