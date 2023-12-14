import ISanitizationStrategy from "."

const uuidSanitizer: ISanitizationStrategy<string> = (input) => {
    return input.replace(/[^\-0-9A-z:]+/gu, '');
}

export default uuidSanitizer;