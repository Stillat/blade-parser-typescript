import { IExtractedAttribute } from '../parser/extractedAttribute';
import { BladeDocument } from './bladeDocument';

export interface IBladeDocumentWithRemovedAttributes {
    doc: BladeDocument,
    attributes:Map<string, IExtractedAttribute>
}