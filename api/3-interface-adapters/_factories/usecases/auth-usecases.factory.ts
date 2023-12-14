import resolveValidateTokenUseCase from "@usecases-internal/auth/validate-token.usecase";
import resolveRefreshAccessTokenUseCase from "@usecases-internal/auth/refresh-access-token.usecase";
import resolveSignInUseCase from "@usecases-internal/auth/sign-in.usecase";
import resolveSignOutUseCase from "@usecases-internal/auth/sign-out.usecase";
import sanitizationFactory from "@adapter-factories/security/sanitization.factory";
import securityFactory from "@adapter-factories/security/security.factory";
import dataAccessFactory from "@adapter-factories/data-access/repository.factory";
import { IRefreshAccessTokenUseCase, ISignInUseCase, ISignOutUseCase, IValidateTokenUseCase } from "@adapter/usecases/auth.boundaries";
import { authPresenterFactory } from "@adapter-factories/web/presenter/auth-presenter.factory";



const authUseCaseFactory = {
    ValidateTokenUseCase: (): IValidateTokenUseCase => {
        return resolveValidateTokenUseCase(
            sanitizationFactory.sessionSanitizer(),
            securityFactory.jwtService(),
            dataAccessFactory.userRepository(),
            authPresenterFactory.ValidateTokenPresenter()
        );
    },
    
    refreshAccessTokenUseCase: (): IRefreshAccessTokenUseCase => {
        return resolveRefreshAccessTokenUseCase(
            sanitizationFactory.sessionSanitizer(),
            dataAccessFactory.sessionRepository(),
            securityFactory.jwtService(),
            authPresenterFactory.refreshAccessTokenPresenter()
        );
    },
    
    signInUseCase: (): ISignInUseCase => {
        return resolveSignInUseCase(
            sanitizationFactory.userSanitizer(),
            securityFactory.hashingService(),
            securityFactory.jwtService(),
            dataAccessFactory.userRepository(),
            dataAccessFactory.sessionRepository(),
            authPresenterFactory.signInPresenter()
        );
    },
    
    signOutUseCase: (): ISignOutUseCase => {
        return resolveSignOutUseCase(
            sanitizationFactory.sessionSanitizer(),
            securityFactory.jwtService(),
            dataAccessFactory.sessionRepository(),
            authPresenterFactory.signOutPresenter()
        );
    },
}

export default authUseCaseFactory;