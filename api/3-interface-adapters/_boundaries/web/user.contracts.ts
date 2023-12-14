import { RestRequest } from "@adapter-internal/web/rest-request";
import { IViewModelResponse } from "@adapter/usecases";
import { IPresenter } from "@usecases/usecases";
import { IGetActiveAccountUseCaseOutput, IGetSessionHistoryUseCaseOutput, ISignUpUseCaseOutput } from "@usecases/usecases/user.contracts";

/**
 * UseCase: sign-up 
 */
export type ISignUpViewModel = IViewModelResponse<{
    name: string;
    email: string;
}>;

export type ISignUpPresenter = IPresenter<ISignUpUseCaseOutput, ISignUpViewModel>


/**
 * UseCase: get-account-by-token
 */
export type IGetActiveAccountViewModel = IViewModelResponse<{
    account: { name: string; email: string; }
}>;

export type IGetActiveAccountPresenter = IPresenter<IGetActiveAccountUseCaseOutput, IGetActiveAccountViewModel>


/**
 * UseCase: get-session-history
 */
export type IGetSessionHistoryViewModel = IViewModelResponse<{
    results: {ip: string, issued: number, expires: number}[]
}>;

export type IGetSessionHistoryPresenter = IPresenter<IGetSessionHistoryUseCaseOutput, IGetSessionHistoryViewModel>


/**
 * UseCase: get-session-history
 */
export interface IUserController {
    signUp(req: RestRequest): ISignUpViewModel
    getMyActiveAccount(req: RestRequest): IGetActiveAccountViewModel
    getSessionHistory(req: RestRequest): IGetSessionHistoryViewModel
}