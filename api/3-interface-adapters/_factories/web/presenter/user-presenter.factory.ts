import { GetActiveAccountPresenter, getSessionHistoryPresenter, signUpPresenter } from "@adapter-internal/web/user/user.presenter";
import { IGetActiveAccountPresenter, IGetSessionHistoryPresenter, ISignUpPresenter } from "@adapter/web/user.contracts";

export const userPresenterFactory = {
    signUpPresenter: (): ISignUpPresenter => {
        return signUpPresenter
    },
    
    GetActiveAccountPresenter: (): IGetActiveAccountPresenter => {
        return GetActiveAccountPresenter
    },

    getSessionHistoryPresenter: (): IGetSessionHistoryPresenter => {
        return getSessionHistoryPresenter
    }
}