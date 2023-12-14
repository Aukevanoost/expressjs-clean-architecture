import ISanitizationStrategy from "."

const keepDirtySanitizer: ISanitizationStrategy<string> = (input) => {
    return input;
}

export default keepDirtySanitizer;