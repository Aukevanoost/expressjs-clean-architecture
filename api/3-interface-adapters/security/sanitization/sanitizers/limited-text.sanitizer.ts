import ISanitizationStrategy from "."

/**
 * Most rules taken from OWASP cheatsheet (Email validation)
 * [src:https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#email-address-validation]
 */ 
const strictTextSanitizer: ISanitizationStrategy<string> = (input) => {
    const unsafeCharacters = ['&','<','>','"',"'", "`"];
    const regex = new RegExp(`[${unsafeCharacters.join()}]`, 'gi');

    return input.substring(0,254).replace(regex, '');
}

export default strictTextSanitizer;