import { Session } from '@entities/session.model';
import { IPresenter, IUseCase } from '.';
import { IHashingBoundary, IJWTBoundary } from '@usecases/security';
import { ISessionInputSanitizer } from '@usecases/security/session.boundaries';
import { ISessionDataAccess } from '@usecases/data-access/session.boundaries';
import { IUserInputSanitizer } from '@usecases/security/user.boundaries';
import { IUserDataAccess } from '@usecases/data-access/user.boundaries';
import { User } from '@entities/user.model';
import { Tokens } from '@entities/token.model';

/*
 * * * * 
 * Validate token UseCase
 */
export type IValidateTokenUseCaseInput = {token?: string, type: 'access_token'|'refresh_token'};

export type IValidateTokenUseCaseOutput = {token?: string, user: User};

export type IValidateTokenUseCaseFactory = <Tviewmodel> (
    sessionSanitizer: ISessionInputSanitizer,
    tokenService: IJWTBoundary,
    userDataAccess: IUserDataAccess,
    presenter: IPresenter<IValidateTokenUseCaseOutput, Tviewmodel>
) => IUseCase<IValidateTokenUseCaseInput, Tviewmodel>


/*
 * * * * 
 * Refresh token UseCase
 */
export type IRefreshAccessTokenUseCaseInput = {refresh_token?: string};

export type IRefreshAccessTokenUseCaseOutput = { session: Session, tokens: Tokens };

export type IRefreshAccessTokenUseCaseFactory = <Tviewmodel> (
    sessionSanitizer: ISessionInputSanitizer,
    sessionDataAccess: ISessionDataAccess,
    tokenService: IJWTBoundary,
    presenter: IPresenter<IRefreshAccessTokenUseCaseOutput, Tviewmodel>
) => IUseCase<IRefreshAccessTokenUseCaseInput, Tviewmodel>


/*
 * *** 
 * Sign in UseCase
 */
export type ISignInUseCaseInput = {email?: string, password?: string, ip?: string};

export type ISignInUseCaseOutput = {user: User, session: Session, tokens: Tokens};

export type ISignInUseCaseFactory = <Tviewmodel> (
    sanitizationService: IUserInputSanitizer,
    hashingService: IHashingBoundary,
    jwtService: IJWTBoundary,
    userDataAccess: IUserDataAccess,
    sessionDataAccess: ISessionDataAccess,
    presenter: IPresenter<ISignInUseCaseOutput, Tviewmodel>,
) => IUseCase<ISignInUseCaseInput, Tviewmodel>


/*   
 * *** 
 * UseCase: sign out
 */
export type ISignOutUseCaseInput = {token?: string};

export type ISignOutUseCaseOutput = Session;

export type ISignOutUseCaseFactory = <Tviewmodel> (
    sanitization: ISessionInputSanitizer,
    jwtService: IJWTBoundary,
    sessionDataAccess: ISessionDataAccess,
    presenter: IPresenter<ISignOutUseCaseOutput, Tviewmodel>,
) => IUseCase<ISignOutUseCaseInput, Tviewmodel>