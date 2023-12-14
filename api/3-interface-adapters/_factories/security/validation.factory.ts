import UserValidationService from "@adapter-internal/security/validation/user-validation.service";
import { IUserInputValidator } from "@usecases/security/user.boundaries";

const validationFactory = {
    userValidator: (): IUserInputValidator => {
        return new UserValidationService();
    }, 
}

export default validationFactory;