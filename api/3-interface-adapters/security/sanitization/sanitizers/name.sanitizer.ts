import ISanitizationStrategy from "."

/**
 * Shoutout to Till Sanders, 
 * [src:https://dev.to/tillsanders/let-s-stop-using-a-za-z-4a0m]
 */ 
const nameSanitizer: ISanitizationStrategy<string> = (input) => {
    return input.replace(/[^\p{Letter}\p{Mark} .,]+/gu, '');
}

export default nameSanitizer;