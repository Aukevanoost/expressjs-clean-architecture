import strictTextSanitizer from './sanitizers/text.sanitizer';
import nameSanitizer from './sanitizers/name.sanitizer';
import { IUserInputSanitizer, ISecurityUserDTO } from '@usecases/security/user.boundaries';
import { Sanitizer } from './sanitizers';
import keepDirtySanitizer from './sanitizers/keep-dirty.sanitizer';

export default class UserSanitizationService implements IUserInputSanitizer {

    clean(dirty: ISecurityUserDTO): Promise<ISecurityUserDTO> {
        return new Promise((resolve, reject) => {
            try {
                const cleanUser = Sanitizer.from(dirty)
                    .sanitize('email', strictTextSanitizer)
                    .sanitize('name', nameSanitizer)
                    .sanitize('ip', strictTextSanitizer)
                    .sanitize('password', keepDirtySanitizer);
                
                resolve(cleanUser.get());
            } catch(e) { reject(e); }
        });
    }
}