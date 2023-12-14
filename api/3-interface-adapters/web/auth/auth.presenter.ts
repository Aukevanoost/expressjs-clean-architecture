import { IRefreshAccessTokenPresenter, ISignInPresenter, ISignOutPresenter, IValidateTokenPresenter } from "@adapter/web/auth.contracts";
import { Response } from "express";


export const ValidateTokenPresenter: IValidateTokenPresenter = (useCase) => {
    
    const present = (res: Response) => useCase.then(({token, user}) => ({
        res,
        body: { 
            access_token: token!,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }));

    return Object.freeze({present});
}

export const signInPresenter: ISignInPresenter = (entity) => {
    
    const present = (res: Response) => {
        return entity.then(({tokens}) => {

            return {
                res, 
                body: {
                    access_token: tokens.access_token.token,
                    refresh_token: tokens.refresh_token.token,
                }
            }
        });
    }

    return Object.freeze({present});
}

export const signOutPresenter: ISignOutPresenter = (entity) => {
    
    const present = (res: Response) => {
        return entity.then(_ => {
            return { res, body: {success: true}  }
        });
    }

    return Object.freeze({present});
}

export const refreshAccessTokenPresenter: IRefreshAccessTokenPresenter = (useCase) => {
    
    const present = (res: Response) => useCase.then(({tokens}) => ({
        res,
        body: {
            access_token: tokens.access_token.token,
            refresh_token: tokens.refresh_token.token,
        }
    }));

    return Object.freeze({present});
}