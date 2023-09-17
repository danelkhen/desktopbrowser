export function isExecutable(extension: string) {
    return [".exe", ".bat", ".com", ".cmd"].includes(extension.toLowerCase())
}
