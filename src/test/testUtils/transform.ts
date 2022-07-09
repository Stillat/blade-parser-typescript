import { BladeDocument } from '../../document/bladeDocument';

export function transformString(text: string): string {
    const doc = BladeDocument.fromText(text),
        transformed = doc.transform().toStructure();

    return doc.transform().fromStructure(transformed);
}