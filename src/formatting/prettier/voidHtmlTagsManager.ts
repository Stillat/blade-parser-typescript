import { BladeDocument } from '../../document/bladeDocument';
import { FragmentsParser } from '../../parser/fragmentsParser';
import { StringUtilities } from '../../utilities/stringUtilities';

export class VoidHtmlTagsManager {
    private static voidElementNames: string[] = [
        'area',
        'base',
        'br',
        'col',
        'command',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr'
    ];

    public static voidTagMapping:Map<string, string> = new Map();

    static adjustInput(content: string): string {
        const tmpDoc = BladeDocument.fromText(content),
            fragmentsParser = new FragmentsParser(),
            tmpSlug = 'Void' + StringUtilities.makeSlug(15);
        fragmentsParser.setIndexRanges(tmpDoc.getParser().getNodeIndexRanges());
        let hasAnyCustomVoidElements = false;

        const fragments = fragmentsParser.parse(content),
            discoveredCustomVoidElements: string[] = [];

        fragments.forEach((fragment) => {
            if (!fragment.isClosingFragment) {
                return;
            }
            const checkName = fragment.name.toLowerCase();

            if (checkName != fragment.name && VoidHtmlTagsManager.voidElementNames.includes(checkName)) {
                hasAnyCustomVoidElements = true;
                discoveredCustomVoidElements.push(checkName);
            }
        });

        if (! hasAnyCustomVoidElements) {
            return content;
        }

        let newText = '',
            lastEnd = 0;

        for (let i = 0; i < fragments.length; i++) {
            const fragment = fragments[i],
                checkName = fragment.name.toLowerCase();

            if (checkName != fragment.name && discoveredCustomVoidElements.includes(checkName)) {
                const safeName = tmpSlug + fragment.name;

                if (!VoidHtmlTagsManager.voidTagMapping.has(safeName)) {
                    VoidHtmlTagsManager.voidTagMapping.set(safeName, fragment.name);
                }

                let fragmentOffset = 1;

                if (fragment.isClosingFragment) {
                    fragmentOffset = 2;
                }

                if (i == 0) {
                    const part = content.substring(0, (fragment.startPosition?.offset ?? 0) + fragmentOffset);
                    newText += part;
                    newText += safeName;
                    lastEnd = (fragment.startPosition?.offset ?? 0) + fragmentOffset + checkName.length;

                    if (fragments.length == 1) {
                        newText += content.substring(lastEnd);
                    }

                    continue;
                } else if (i == fragments.length - 1) {
                    if (fragments.length == 1) {
                        const part = content.substring(0, (fragment.startPosition?.offset ?? 0) + fragmentOffset);
                        newText += part;
                    } else {
                        const part = content.substring(lastEnd, (fragment.startPosition?.offset ?? 0) + fragmentOffset);
                        newText += part;
                    }
                    newText += safeName;
                    lastEnd = (fragment.startPosition?.offset ?? 0) + fragmentOffset + checkName.length;

                    newText += content.substring(lastEnd);
                    break;
                } else {
                    const part = content.substring(lastEnd, (fragment.startPosition?.offset ?? 0) + fragmentOffset);
                    newText += part;
                    newText += safeName;
                    lastEnd = (fragment.startPosition?.offset ?? 0) + fragmentOffset + checkName.length;
                    continue;
                }
            }
        }

        return newText;
    }
}