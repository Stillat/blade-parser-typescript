import { BladeError } from '../errors/bladeError.js';
import { BladeDocument } from './bladeDocument.js';

export class DocumentErrors {
    private doc: BladeDocument;

    constructor(doc: BladeDocument) {
        this.doc = doc;
    }

    hasStructureErrors() {
        return this.doc.getParser().getStructureErrors().length > 0;
    }

    getFirstStructureError(): BladeError {
        return this.doc.getParser().getStructureErrors()[0];
    }

    hasAny() {
        return this.all().length > 0;
    }

    all() {
        const errorHashes: string[] = [],
            errors: BladeError[] = [];

        this.doc.getAllNodes().forEach((node) => {
            node.getErrors().forEach((error) => {
                if (errorHashes.includes(error.hash()) == false) {
                    errorHashes.push(error.hash());
                    errors.push(error);
                }

            });
        });

        this.doc.getParser().getErrors().forEach((error) => {
            if (errorHashes.includes(error.hash()) == false) {
                errorHashes.push(error.hash());
                errors.push(error);
            }
        });

        return errors;
    }
}