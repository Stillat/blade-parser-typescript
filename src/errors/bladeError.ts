import { AbstractNode } from '../nodes/nodes.js';
import { Range } from '../nodes/position.js';

export enum ErrrorLevel {
    Error = 0,
    Warning = 1
}

export class BladeError {
    public node: AbstractNode | null = null;
    public errorCode = '';
    public message = '';
    public level: ErrrorLevel = ErrrorLevel.Error;
    public range: Range | null = null;

    hash() {
        let positionSlug = '';

        if (this.node != null) {
            positionSlug = (this.node.endPosition?.offset ?? 0).toString() + "|" +
                (this.node.startPosition?.offset ?? 0).toString() + "|";
        }

        return positionSlug + "|" + this.errorCode;
    }

    static makeSyntaxError(errorCode: string, node: AbstractNode | null, message: string, level?: ErrrorLevel) {
        if (level == null) {
            level = ErrrorLevel.Error;
        }

        const error = new BladeError();

        error.errorCode = errorCode;
        error.node = node;
        error.message = message;
        error.level = level;

        return error;
    }
}