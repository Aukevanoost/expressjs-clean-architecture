import resolveUserController from "@adapter-internal/web/user/user.controller";
import resolveAuthController from "@adapter-internal/web/auth/auth.controller";
import userUseCaseFactory from "@adapter-factories/usecases/user-usecases.factory";
import authUseCaseFactory from "@adapter-factories/usecases/auth-usecases.factory";
import { IAuthController } from "@adapter/web/auth.contracts";
import { IUserController } from "@adapter/web/user.contracts";

const controllerFactory = {    
    authController: (): IAuthController => {
        return resolveAuthController(
            authUseCaseFactory.ValidateTokenUseCase(),
            authUseCaseFactory.signInUseCase(),
            authUseCaseFactory.signOutUseCase(),
            authUseCaseFactory.refreshAccessTokenUseCase()
        );
    },
    
    userController: (): IUserController => {
        return resolveUserController(
            userUseCaseFactory.signUpUseCase(),
            userUseCaseFactory.GetActiveAccountUseCase(),
            userUseCaseFactory.getSessionHistoryUseCase()
        );
    }
}

export default controllerFactory;