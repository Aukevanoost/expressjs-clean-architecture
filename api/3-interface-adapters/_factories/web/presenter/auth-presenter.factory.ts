import { ValidateTokenPresenter, refreshAccessTokenPresenter, signInPresenter, signOutPresenter } from "@adapter-internal/web/auth/auth.presenter";
import { IRefreshAccessTokenPresenter, ISignInPresenter, ISignOutPresenter, IValidateTokenPresenter } from "@adapter/web/auth.contracts";

export const authPresenterFactory = {
    ValidateTokenPresenter: (): IValidateTokenPresenter => {
        return ValidateTokenPresenter;
    }, 
    
    signInPresenter: (): ISignInPresenter => {
        return signInPresenter;
    }, 

    signOutPresenter: (): ISignOutPresenter => {
        return signOutPresenter;
    }, 

    refreshAccessTokenPresenter: (): IRefreshAccessTokenPresenter => {
        return refreshAccessTokenPresenter;
    }, 
}