import resolveSignUpUseCase from "@usecases-internal/auth/sign-up.usecase";
import dataAccessFactory from "../data-access/repository.factory";
import sanitizationFactory from "../security/sanitization.factory";
import validationFactory from "../security/validation.factory";
import resolveGetSessionHistoryUseCase from "@usecases-internal/user/get-session-history.usecase";
import resolveGetActiveAccountUseCase from "@usecases-internal/user/get-account-by-token.usecase";
import securityFactory from "@adapter-factories/security/security.factory";
import { userPresenterFactory } from "@adapter-factories/web/presenter/user-presenter.factory";
import { IGetActiveAccountUseCase, IGetSessionHistoryUseCase, ISignUpUseCase } from "@adapter/usecases/user.boundaries";

const signUpUseCase = (): ISignUpUseCase => {
    return resolveSignUpUseCase(
        validationFactory.userValidator(),
        sanitizationFactory.userSanitizer(),
        securityFactory.hashingService(),
        dataAccessFactory.userRepository(),
        userPresenterFactory.signUpPresenter()
    );
}

const getSessionHistoryUseCase = (): IGetSessionHistoryUseCase => {
    return resolveGetSessionHistoryUseCase(
        dataAccessFactory.sessionRepository(),
        userPresenterFactory.getSessionHistoryPresenter()
    );
}

const GetActiveAccountUseCase = (): IGetActiveAccountUseCase => {
    return resolveGetActiveAccountUseCase(
        dataAccessFactory.userRepository(),
        userPresenterFactory.GetActiveAccountPresenter()
    );
}

const userUseCaseFactory = {
    signUpUseCase,
    GetActiveAccountUseCase,
    getSessionHistoryUseCase
}

export default userUseCaseFactory;