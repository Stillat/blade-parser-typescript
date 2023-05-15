import { ArrayNode } from '../../nodes/nodes';
import { StringBuffer } from './stringBuffer';

export class ArrayPrinter {
    static print(array: ArrayNode, tabSize: number, level: number) {
        const arrayBuffer = new StringBuffer(tabSize, level);

        arrayBuffer.append('[').newLine();

        if (array.elements.length > 0) {
            let trailingWs = '';

            arrayBuffer.indent();

            array.elements.forEach((element) => {
                if (array.maxKeyLength > 0 && element.key != null) {
                    trailingWs = '';
                }

                if (element.key != null) {
                    arrayBuffer.append(element.key.sourceContent + trailingWs).append(' => ');

                    if (element.value != null) {
                        if (element.value instanceof ArrayNode) {
                            arrayBuffer.append(ArrayPrinter.print(element.value, tabSize, level + 1));
                        } else {
                            arrayBuffer.append(element.value.sourceContent);
                        }
                    }
                } else {
                    if (element.value != null) {
                        if (element.value instanceof ArrayNode) {
                            arrayBuffer.append(ArrayPrinter.print(element.value, tabSize, level + 1));
                        } else {
                            arrayBuffer.append(element.value.sourceContent);
                        }
                    }
                }

                arrayBuffer.appendNoRepeat(',').newLine();

                if (!element.isLast) {
                    arrayBuffer.indent();
                }
            });
        }

        if (level > 1) {
            arrayBuffer.outdent();
        }

        arrayBuffer.append(']');

        return arrayBuffer.getContents();
    }
}