import passwordValidator from './validators/password.validator';
import emailValidator from './validators/email.validator';
import { ValidationError } from 'util/errors/validation.error';
import { IUserInputValidator, ISecurityUserDTO } from '@usecases/security/user.boundaries';

export default class UserValidationService implements IUserInputValidator {

    check(dto: ISecurityUserDTO): Promise<Required<ISecurityUserDTO>> {

        return new Promise((resolve, reject) => {
            try {
                if(!dto.name) {
                    reject(new ValidationError("Invalid name")); return;
                }

                if(!dto.email || !emailValidator(dto.email)) {
                    reject(new ValidationError("Invalid email address")); return;
                }

                if(!dto.password || !passwordValidator(dto.password)) {
                    reject(new ValidationError("Invalid password")); return;
                }

                resolve(dto as Required<ISecurityUserDTO>);
            } catch(e) { reject(e); }
        });


    }
}