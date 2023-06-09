import { IExtractedAttribute } from '../parser/extractedAttribute';
import { StringUtilities } from '../utilities/stringUtilities';

export class AttributeRangeRemover {

    private attributeMapping: Map<string, IExtractedAttribute> = new Map();
    private slugs: string[] = [];

    private makeSlug(): string {
        const slug = StringUtilities.makeSlug(32);

        if (this.slugs.includes(slug)) {
            return this.makeSlug();
        }

        this.slugs.push(slug);

        return slug;
    }


    remove(content: string, ranges: IExtractedAttribute[]) {
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
                newContent += '"' + rangeSlug + '"';
                newContent += content.substring(lastEnd);
            } else {
                const part = content.substring(lastEnd, range.startedOn);
                lastEnd = range.startedOn + range.content.length;
                newContent += part;
                newContent += '"' + rangeSlug + '"';
            }
        }

        return newContent;
    }

    getRemovedAttributes() {
        return this.attributeMapping;
    }
}