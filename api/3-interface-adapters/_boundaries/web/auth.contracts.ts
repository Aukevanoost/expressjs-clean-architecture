import { RestRequest } from "@adapter-internal/web/rest-request";
import { IViewModelResponse } from "@adapter/usecases";
import { IPresenter } from "@usecases/usecases";
import { IRefreshAccessTokenUseCaseOutput, ISignInUseCaseOutput, ISignOutUseCaseOutput, IValidateTokenUseCaseOutput } from "@usecases/usecases/auth.contracts";

/**
 * UseCase: validate-token 
 */
export type IValidateTokenViewModel = IViewModelResponse<{access_token: string, user: {id: string, name: string, email: string}}>;

export type IValidateTokenPresenter = IPresenter<IValidateTokenUseCaseOutput, IValidateTokenViewModel>


/**
 * UseCase: sign-in 
 */
export type ISignInViewModel = IViewModelResponse<{
    access_token: string;
    refresh_token: string;
}>;

export type ISignInPresenter = IPresenter<ISignInUseCaseOutput, ISignInViewModel>


/**
 * UseCase: sign-out
 */
export type ISignOutViewModel = IViewModelResponse<{success: boolean}>;

export type ISignOutPresenter = IPresenter<ISignOutUseCaseOutput, ISignOutViewModel>



/**
 * UseCase: refresh-token 
 */
export type IRefreshAccessTokenViewModel = IViewModelResponse<{access_token: string, refresh_token: string}>;

export type IRefreshAccessTokenPresenter = IPresenter<IRefreshAccessTokenUseCaseOutput, IRefreshAccessTokenViewModel>

export interface IAuthController {
    validateAccessToken(req: RestRequest): IValidateTokenViewModel,
    validateRefreshToken(req: RestRequest): IValidateTokenViewModel,
    signIn(req: RestRequest): ISignInViewModel,
    signOut(req:RestRequest): ISignOutViewModel,
    refreshAccessToken(req: RestRequest): IRefreshAccessTokenViewModel
}