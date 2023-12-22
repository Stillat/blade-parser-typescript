import { BladeDocument } from '../../document/bladeDocument.js';

export function transformString(text: string): Promise<string> {
    const doc = BladeDocument.fromText(text),
        transformed = doc.transform().toStructure();

    return doc.transform().fromStructure(transformed);
}