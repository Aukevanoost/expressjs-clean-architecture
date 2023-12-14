import { IUseCase } from "@usecases/usecases";
import { IValidateTokenUseCaseInput, IRefreshAccessTokenUseCaseInput, ISignInUseCaseInput, ISignOutUseCaseInput } from "@usecases/usecases/auth.contracts";
import { IRefreshAccessTokenViewModel, ISignInViewModel, ISignOutViewModel, IValidateTokenViewModel } from "@adapter/web/auth.contracts";

/**
 * UseCase: validate-token 
 */
export type IValidateTokenUseCase = IUseCase<IValidateTokenUseCaseInput, IValidateTokenViewModel>;

/**
 * UseCase: sign-out 
 */
export type ISignOutUseCase = IUseCase<ISignOutUseCaseInput, ISignOutViewModel>

/**
 * UseCase: sign-in 
 */
export type ISignInUseCase = IUseCase<ISignInUseCaseInput, ISignInViewModel>

/**
 * UseCase: refresh-token 
 */
export type IRefreshAccessTokenUseCase = IUseCase<IRefreshAccessTokenUseCaseInput, IRefreshAccessTokenViewModel>;