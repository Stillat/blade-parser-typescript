import crypto from 'crypto';
import * as fs from 'fs';

interface ICachedPintResults {
    contentMapping: string,
    resultMapping: string,
}

export interface IRestoredCacheResults {
    contentMapping: Map<string, string>,
    resultMapping: Map<string, string>
}

export class PintCache {
    private cacheDir: string = '';
    private cacheVersion = '4';

    constructor(cacheDir: string) {
        this.cacheDir = cacheDir;
    }

    private generateSHA1Hash(input: string): string {
        const hash = crypto.createHash('sha1');
        hash.update(input);

        return '_pint' + this.cacheVersion + '_' + hash.digest('hex');
    }

    private getCachePath(path: string): string {
        return this.cacheDir + this.generateSHA1Hash(path) + '.json';
    }

    canCache(path: string): boolean {
        if (typeof path == 'undefined') {
            return false;
        }

        return path.trim().length > 0;
    }

    has(path: string): boolean {
        if (typeof path == 'undefined') {
            return false;
        }

        return fs.existsSync(this.getCachePath(path));
    }

    private serializeMap(map: Map<string, string>) {
        return JSON.stringify(Array.from(map.entries()));
    }

    private unserializeMap(serializedMap: string): Map<string, string> {
        const entries: [string, string][] = JSON.parse(serializedMap);
        return new Map(entries);
    }

    put(path: string, resultMapping: Map<string, string>, contentMapping: Map<string, string>) {
        const cachePath = this.getCachePath(path),
            cacheEntry: ICachedPintResults = {
                resultMapping: this.serializeMap(resultMapping),
                contentMapping: this.serializeMap(contentMapping)
            };

        fs.writeFileSync(cachePath, JSON.stringify(cacheEntry));
    }

    get(path: string): IRestoredCacheResults {
        const cacheContent = fs.readFileSync(this.getCachePath(path), { encoding: 'utf8' }),
            decodedContent = JSON.parse(cacheContent) as ICachedPintResults;

        return {
            contentMapping: this.unserializeMap(decodedContent.contentMapping),
            resultMapping: this.unserializeMap(decodedContent.resultMapping)
        };
    }

    isValid(cachedContent: Map<string, string>, templateContent: Map<string, string>) {
        if (cachedContent.size !== templateContent.size) {
            return false;
        }

        // Iterate over the entries and compare key-value pairs
        for (const [key, value] of cachedContent.entries()) {
            if (!templateContent.has(key) || templateContent.get(key) !== value) {
                return false;
            }
        }

        return true;
    }
}