import { IGetActiveAccountUseCase, IGetSessionHistoryUseCase, ISignUpUseCase } from "@adapter/usecases/user.boundaries";
import { IUserController } from "@adapter/web/user.contracts";
import { RestRequest } from "../rest-request";
import headerMapper from "../mappers/header.mapper";

const resolveUserController = (
    signUpUseCase: ISignUpUseCase,
    GetActiveAccountUseCase: IGetActiveAccountUseCase,
    getSessionHistoryUseCase: IGetSessionHistoryUseCase
): IUserController => {

    const signUp = (req: RestRequest) => {
        return signUpUseCase(req.body);
    }

    const getMyActiveAccount = (req: RestRequest) => {
        return GetActiveAccountUseCase({user: req.user});
    }

    const getSessionHistory = (req: RestRequest) => {
        const range = req.headers.range;
        return getSessionHistoryUseCase({user: req.user, range});
    }

    return Object.freeze({signUp, getMyActiveAccount, getSessionHistory});
}

export default resolveUserController;