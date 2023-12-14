import SessionSanitizationService from "@adapter-internal/security/sanitization/session-sanitization.service";
import UserSanitizationService from "@adapter-internal/security/sanitization/user-sanitization.service";
import { ISessionInputSanitizer } from "@usecases/security/session.boundaries";
import { IUserInputSanitizer } from "@usecases/security/user.boundaries";

const sanitizationFactory = {
    userSanitizer: (): IUserInputSanitizer => {
        return new UserSanitizationService();
    }, 

    sessionSanitizer: (): ISessionInputSanitizer => {
        return new SessionSanitizationService();
    }
}

export default sanitizationFactory;