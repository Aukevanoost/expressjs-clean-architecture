import { IRefreshAccessTokenUseCase, ISignInUseCase, ISignOutUseCase, IValidateTokenUseCase } from "@adapter/usecases/auth.boundaries";
import { IAuthController } from "@adapter/web/auth.contracts";
import { RestRequest } from "../rest-request";
import headerMapper from "../mappers/header.mapper";


const resolveAuthController = (
    ValidateTokenUseCase: IValidateTokenUseCase,
    signInUseCase: ISignInUseCase,
    signOutUseCase: ISignOutUseCase,
    refreshAccessTokenUseCase: IRefreshAccessTokenUseCase
): IAuthController => {

    const validateAccessToken = (req: RestRequest) => {
        const token = headerMapper.Token(req);
        return ValidateTokenUseCase({ token, type: 'access_token' });
    }

    const validateRefreshToken = (req: RestRequest) => {
        const token = headerMapper.Token(req);
        return ValidateTokenUseCase({ token, type: 'refresh_token' });
    }

    const refreshAccessToken = (req: RestRequest) => {
        const token = headerMapper.Token(req);
        return refreshAccessTokenUseCase({refresh_token: token});
    }

    const signIn = (req: RestRequest) => {
        return signInUseCase({email: req.body?.email, password: req.body?.password, ip: req.ip});
    }

    const signOut = (req: RestRequest) => {
        const token = headerMapper.Token(req);
        return signOutUseCase({token});
    }

    return Object.freeze({
        validateAccessToken, 
        validateRefreshToken, 
        signIn, 
        signOut, 
        refreshAccessToken
    });
}

export default resolveAuthController;