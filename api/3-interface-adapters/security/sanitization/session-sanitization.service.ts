import { Sanitizer } from './sanitizers';
import strictTextSanitizer from './sanitizers/text.sanitizer';
import { ISecuritySessionDTO, ISessionInputSanitizer } from '@usecases/security/session.boundaries';

export default class SessionSanitizationService implements ISessionInputSanitizer {

    clean(dirty: ISecuritySessionDTO): Promise<ISecuritySessionDTO> {
        return new Promise((resolve, reject) => {
            try {
                const cleanSession = Sanitizer.from(dirty)
                    .sanitize('token', strictTextSanitizer);

                resolve(cleanSession.get());
            } catch(e) { reject(e); }
        });
    }
}