import { IGetActiveAccountPresenter, IGetSessionHistoryPresenter, ISignUpPresenter } from "@adapter/web/user.contracts";
import { Response } from "express";
import headerMapper from "../mappers/header.mapper";

export const signUpPresenter: ISignUpPresenter = (entity) => {
    
    const present = (res: Response) => {
        return entity.then(({name, email}) => ({ 
            res,
            body: { name, email }
        }))
    }

    return Object.freeze({present});
}

export const GetActiveAccountPresenter: IGetActiveAccountPresenter = (useCase) => {
    
    const present = (res: Response) => {
        return useCase.then(({account}) => {
            return {
                res, 
                body: {
                    account: {
                        name: account.name,
                        email: account.email
                    }
                }
            }
        });
    }

    return Object.freeze({present});
}


export const getSessionHistoryPresenter: IGetSessionHistoryPresenter = (useCase) => {
    
    const present = (res: Response) => {
        return useCase.then((useCaseOutput) => {
            res = headerMapper.ContentRange(res, 'User', useCaseOutput.range);
            return {
                res, 
                body: {
                    results: useCaseOutput.results.map(({ip, issued, expires}) => ({ip, issued, expires}))
                }
            }
        });
    }

    return Object.freeze({present});
}