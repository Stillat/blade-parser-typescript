import { BladeCommentNode, BladeEchoNode, DirectiveNode, InlinePhpNode, LiteralNode } from '../nodes/nodes';
import { IExtractedAttribute } from '../parser/extractedAttribute';
import { StringUtilities } from '../utilities/stringUtilities';
import { BladeDocument } from './bladeDocument';
import { DocumentPadder } from './documentPadder';

let canProcessAttributes: boolean = true;

export function disableAttributeProcessing() {
    canProcessAttributes = false;
}

export function enableAttributeProcessing() {
    canProcessAttributes = true;
}

export { canProcessAttributes };

export class AttributeRangeRemover {

    private attributeMapping: Map<string, IExtractedAttribute> = new Map();
    private slugs: string[] = [];

    private makeSlug(length: number): string {
        const slug = StringUtilities.makeSlug(length);

        if (this.slugs.includes(slug)) {
            return this.makeSlug(length + 1);
        }

        this.slugs.push(slug);

        return slug;
    }


    remove(content: string, ranges: IExtractedAttribute[]) {
        let newContent = '',
            lastEnd = 0;

        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i],
                rangeSlug = this.makeSlug(range.content.length);

            this.attributeMapping.set(rangeSlug, range);

            if (i == 0) {
                const part = content.substring(0, range.startedOn);
                lastEnd = range.startedOn + range.content.length;
                newContent += part;
                newContent += '"' + rangeSlug + '" ' + "\n";

                if (ranges.length == 1) {
                    newContent += content.substring(lastEnd);
                }
            } else if (i == ranges.length - 1) {
                if (ranges.length == 1) {
                    const part = content.substring(0, range.startedOn);
                    newContent += part;
                }
                const part = content.substring(lastEnd, range.startedOn);
                lastEnd = range.startedOn + range.content.length;
                newContent += part;
                newContent += '"' + rangeSlug + '" ' + "\n";
                newContent += content.substring(lastEnd);
            } else {
                const part = content.substring(lastEnd, range.startedOn);
                lastEnd = range.startedOn + range.content.length;
                newContent += part;
                newContent += '"' + rangeSlug + '" ' + "\n";
            }
        }
        
        return newContent;
    }

    getRemovedAttributes() {
        return this.attributeMapping;
    }
}