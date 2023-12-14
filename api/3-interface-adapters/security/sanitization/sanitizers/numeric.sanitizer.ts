import ISanitizationStrategy from "."

const numberSanitizer: ISanitizationStrategy<string> = (input) => {
    return input.replace(/[^0-9,._+e]/gi, '');
}

export default numberSanitizer;