import * as fs from 'fs';
import * as path from 'path';
import { setPrettierFilePath } from '../formatting/optionDiscovery';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

function getBladePhpFiles(directory: string): string[] {
    const bladePhpFiles: string[] = [];

    function traverseDirectory(dir: string): void {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const fileStat = fs.statSync(filePath);

            if (fileStat.isDirectory()) {
                traverseDirectory(filePath);
            } else if (file.endsWith('.blade.php')) {
                bladePhpFiles.push(filePath);
            }
        }
    }

    traverseDirectory(directory);
    return bladePhpFiles;
}

export function formatBladeFilesInDirecetory(directory: string) {
    const bladeFiles = getBladePhpFiles(directory);
    let formatted = 0;

    bladeFiles.forEach((file) => {
        try {
            console.clear();
            formatted += 1;
            console.log(`Formatting ${formatted}/${bladeFiles.length}: ${path.basename(file)}`);
            const contents = fs.readFileSync(file, { encoding: 'utf8' });
            setPrettierFilePath(file);
            console.log(formatBladeStringWithPint(contents));
        } catch (err) {
            console.error(err);
            debugger;
        }
    });
}