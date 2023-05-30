import { Parser } from 'php-parser';
import { StringRemover } from '../parser/stringRemover';
import { formatAsHtml } from './prettier/utils';
import { StringUtilities } from '../utilities/stringUtilities';

export class ClassStringEmulation {
    extractContent(input: string): string[] {
        const regex = /class-string-emulate-start([\s\S]*?)class-string-emulate-end/g;
        const matches = input.match(regex);
        if (matches) {
            return matches.map((match) => match.replace('class-string-emulate-start', '').replace('class-string-emulate-end', '').trim());
        }
        return [];
    }

    transform(content: string): string {
        let tContent = content;
        this.extractContent(content).forEach((value) => {
            const remover = new StringRemover();
            let newContent = value;
            remover.remove(value);
            let extracted = Array.from(new Set(remover.getStrings()));
            let newDoc = '';

            extracted.forEach((extraction) => {
                newDoc += `<!-- "Emulate:${extraction}"-->\n`;
                newDoc += `<div class="${extraction}"></div>\n`;
            });

            newDoc = formatAsHtml(newDoc);
            remover.remove(newDoc);
            extracted = Array.from(new Set(remover.getStrings()));

            const newClasses:string[] = [],
                resultMapping:Map<string, string> = new Map();

            for (let i = 0;i < extracted.length; i++) {
                let line = extracted[i];

                if (line.startsWith('Emulate:')) {
                    line = line.substring('Emulate:'.length);
                    newClasses.push(line);
                }

                if (i + 1 < extracted.length) {
                    resultMapping.set(line, extracted[i + 1]);
                }

                i += 1;
            }

            
            newClasses.sort((a, b) => b.length - a.length).forEach((classString) => {
                if (resultMapping.has(classString)) {
                    newContent = StringUtilities.replaceAllInString(newContent, classString, resultMapping.get(classString) as string);
                }
            });

            tContent = tContent.replace(value, newContent);
        });

        return tContent;
    }
}
