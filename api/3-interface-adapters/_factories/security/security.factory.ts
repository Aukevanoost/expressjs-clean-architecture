import { HashingService } from '@adapter-internal/security/hashing.service';
import { JWTService } from '@adapter-internal/security/token/jwt.service';
import { IHashingBoundary, IJWTBoundary } from '@usecases/security';

const securityFactory = {
    hashingService: (): IHashingBoundary => {
        return new HashingService();
    },

    jwtService: (): IJWTBoundary => {
        return new JWTService();
    }
}

export default securityFactory;