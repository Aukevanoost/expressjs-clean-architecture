import ISanitizationStrategy from "."

const defaultSanitizer: ISanitizationStrategy<string> = (input) => {

    const cleanInput = () => input.replace(regex, replacer);

    /**
     * OWASP XSS Prevention
     * [src: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html]
     */ 
    const unsafeHTMLCharacters: {[key:string]: string} = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
    };

    const regex = new RegExp(`[${Object.keys(unsafeHTMLCharacters).join()}]`, 'gi');

    const replacer = (unsafeChar:string) => unsafeHTMLCharacters[unsafeChar] as string;

    return cleanInput();
}

export default defaultSanitizer;