import { IExtractedAttribute } from '../parser/extractedAttribute';
import { StringUtilities } from '../utilities/stringUtilities';

export class AttributeRangeRemover {

    private ranges: IExtractedAttribute[] = [];
    private attributeMapping: Map<string, IExtractedAttribute> = new Map();
    private originalContent: string = '';
    private slugs: string[] = [];
    private content: string = '';

    private makeSlug(): string {
        const slug = StringUtilities.makeSlug(32);

        if (this.slugs.includes(slug)) {
            return this.makeSlug();
        }

        this.slugs.push(slug);

        return slug;
    }


    remove(content: string, ranges: IExtractedAttribute[]) {
        this.originalContent = content;
        this.ranges = ranges;

        let newContent = '',
            lastEnd = 0;

        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i],
                rangeSlug = this.makeSlug();

            this.attributeMapping.set(rangeSlug, range);

            if (i == 0) {
                const part = content.substring(0, range.startedOn);
                lastEnd = range.startedOn + range.content.length;
                newContent += part;
                newContent += '"' + rangeSlug + '"';
            } else if (i == ranges.length - 1) {
                // TODO: Edge case if there is only ONE.
                const part = content.substring(lastEnd, range.startedOn);
                lastEnd = range.startedOn + range.content.length;
                newContent += part;
                newContent += '"' + rangeSlug + '"';
                newContent += content.substring(lastEnd);
            } else {
                const part = content.substring(lastEnd, range.startedOn);
                lastEnd = range.startedOn + range.content.length;
                newContent += part;
                newContent += '"' + rangeSlug + '"';
            }
        }

        this.content = newContent;

        return newContent;
    }
}