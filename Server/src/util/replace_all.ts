export function replaceAll(string: string, search: string, replacement: string) {
    return string.replace(new RegExp(search, 'g'), replacement);
}
