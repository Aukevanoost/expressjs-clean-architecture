import IValidationStrategy from "."

/**
 * OWASP Recommendation
 * [src: https://owasp.org/www-community/OWASP_Validation_Regex_Repository]
 */ 
const emailValidator: IValidationStrategy<string> = (input) => {
    const OWASP_Email_Regex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return OWASP_Email_Regex.test(input)
}

export default emailValidator;