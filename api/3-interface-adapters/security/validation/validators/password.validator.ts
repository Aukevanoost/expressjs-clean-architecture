import IValidationStrategy from "."

/**
 * OWASP Recommendation
 * [src: https://owasp.org/www-community/OWASP_Validation_Regex_Repository]
 */ 
const passwordValidator: IValidationStrategy<string> = (input) => {
    const special_chars = ['!','@','#','$','%','&','*', '?', '€', '+', '-'];
    const minlength = 8;
    const OWASP_passwd_regex = new RegExp(`^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[${special_chars.join()}]).{4,}$`);

    const isValidLength = input.length >= minlength;

    return isValidLength && OWASP_passwd_regex.test(input);
}

export default passwordValidator;