import { IUserDataAccess } from '@usecases/data-access/user.boundaries';
import { IHashingBoundary, IJWTBoundary } from '@usecases/security';
import { IUserInputSanitizer, IUserInputValidator } from '@usecases/security/user.boundaries';

import { IUseCase, IPresenter } from '.';
import { Session } from '@entities/session.model';
import { ISessionDataAccess } from '@usecases/data-access/session.boundaries';
import { ISessionInputSanitizer } from '@usecases/security/session.boundaries';
import { User } from '@entities/user.model';
import { IRecordRange } from '@usecases/data-access';

/*   
 * *** 
 * UseCase: get account
 */
export type IGetActiveAccountUseCaseInput = {user?: {id: string} };

export type IGetActiveAccountUseCaseOutput = {account: User};

export type IGetActiveAccountUseCaseFactory = <Tviewmodel> (
    userDataAccess: IUserDataAccess,
    presenter: IPresenter<IGetActiveAccountUseCaseOutput, Tviewmodel>
) => IUseCase<IGetActiveAccountUseCaseInput, Tviewmodel>

/*   
 * *** 
 * UseCase: get Session history
 */
export type IGetSessionHistoryUseCaseInput = {user?: {id: string}, range: [number,number] };

export type IGetSessionHistoryUseCaseOutput = { results: Session[], range: IRecordRange};

export type IGetSessionHistoryUseCaseFactory = <Tviewmodel> (
    sessionDataAccess: ISessionDataAccess,
    presenter: IPresenter<IGetSessionHistoryUseCaseOutput,Tviewmodel>
) => IUseCase<IGetSessionHistoryUseCaseInput, Tviewmodel>

/*   
 * *** 
 * Sign up UseCase
 */
export type ISignUpUseCaseInput = {name?: string;email?: string;password?: string;} 

export type ISignUpUseCaseOutput = User;

export type ISignUpUseCaseFactory = <Tpresenter> (
    validationService: IUserInputValidator,
    sanitizationService: IUserInputSanitizer,
    hashingService: IHashingBoundary,
    userDataAccess: IUserDataAccess,
    presenter: IPresenter<ISignUpUseCaseOutput, Tpresenter>
) => IUseCase<ISignUpUseCaseInput, Tpresenter>
