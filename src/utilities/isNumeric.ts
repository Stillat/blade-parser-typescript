// Source: https://github.com/locutusjs/locutus/blob/master/src/php/var/is_numeric.js

const whitespace = [
    ' ',
    '\n',
    '\r',
    '\t',
    '\f',
    '\x0b',
    '\xa0',
    '\u2000',
    '\u2001',
    '\u2002',
    '\u2003',
    '\u2004',
    '\u2005',
    '\u2006',
    '\u2007',
    '\u2008',
    '\u2009',
    '\u200a',
    '\u200b',
    '\u2028',
    '\u2029',
    '\u3000'
].join('');

export function is_numeric(char: string): boolean {
    return (typeof char === 'number' ||
        (typeof char === 'string' &&
            whitespace.indexOf(char.slice(-1)) === -1)) &&
            char !== '' &&
        !isNaN(char as any);
}