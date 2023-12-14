import { Session } from '@entities/session.model';
import { Tokens } from '@entities/token.model';
import { DatabaseRecord, ONE_RECORD } from '@usecases/data-access';
import { SessionDAO } from '@usecases/data-access/dao/session.dao';
import { ISessionDataAccess } from '@usecases/data-access/session.boundaries';
import { IJWTBoundary, IJWTBoundaryOutput } from '@usecases/security';
import { ISecuritySessionDTO, ISessionInputSanitizer } from '@usecases/security/session.boundaries';
import { UseCase } from '@usecases/usecases';
import { IRefreshAccessTokenUseCaseFactory, IRefreshAccessTokenUseCaseInput, IRefreshAccessTokenUseCaseOutput } from "@usecases/usecases/auth.contracts";
import { AuthenticationError } from 'util/errors/authentication.error';
import { ValidationError } from 'util/errors/validation.error';

const resolveRefreshAccessTokenUseCase: IRefreshAccessTokenUseCaseFactory = (
    sessionSanitizer: ISessionInputSanitizer,
    sessionDataAccess: ISessionDataAccess,
    jwtService: IJWTBoundary,
    authPresenter,
) => {

    /**
     * UseCase: refresh-token
     * @param useCaseInput 
     * @returns viewmodel
     */
    const refreshAccessTokenUseCase = (useCaseInput: IRefreshAccessTokenUseCaseInput) => {

        const outputBoundary = UseCase.of(useCaseInput)
            .then(sanitizeRefreshToken)
            .then(validateRefreshToken)
            .then(getActiveTokenSession)
            .then(generateNewTokens)
            .then(updateCurrentSession);
        
        return authPresenter(outputBoundary);
    }

    const sanitizeRefreshToken = (session: IRefreshAccessTokenUseCaseInput) 
        : Promise<ISecuritySessionDTO> => {
            return sessionSanitizer.clean({token: session.refresh_token});
        }
        
    const validateRefreshToken = ({token}: ISecuritySessionDTO)
        : Promise<IJWTBoundaryOutput> => {
            if(!token) throw new ValidationError("'refresh_token' is not provided");
            return jwtService.verify(token, {type: 'refresh_token'});
        }

    const getActiveTokenSession = (refresh_token: IJWTBoundaryOutput)
        : Promise<{session: DatabaseRecord<SessionDAO>, refresh_token: IJWTBoundaryOutput}> => {
            return sessionDataAccess
                .get(ONE_RECORD,{refresh_token: refresh_token.body.id})
                .then((session) => {
                    if(!session.results[0]) throw new AuthenticationError("No active access token found.");  
                    if(jwtService.isExpired(session.results[0].expires)) throw new AuthenticationError("Token is expired.") 
                    return { session: session.results[0], refresh_token };
                })
        }
        
    const generateNewTokens = ({session, refresh_token}: {session: Session, refresh_token: IJWTBoundaryOutput})
        : Promise<{session: Session, tokens: {refresh_token: IJWTBoundaryOutput, access_token: IJWTBoundaryOutput}}> => {
            const identity = {user: refresh_token.body.user, email: refresh_token.body.email};
            return Promise.all([
                jwtService.generateAccessToken(identity), 
                jwtService.generateRefreshToken(identity)
            ])
                .then(([access_token, refresh_token]) => ({session, tokens: {access_token, refresh_token}})
            )
        }

    const updateCurrentSession = ({session, tokens}: {session: Session, tokens: Tokens})
        : Promise<IRefreshAccessTokenUseCaseOutput> => {
            return sessionDataAccess
                .update(session.id, {
                    access_token: tokens.access_token.body.id,
                    refresh_token: tokens.refresh_token.body.id,
                    expires: tokens.refresh_token.body.expires 
                })
                .then(session => ({ session, tokens }));
        }

    return refreshAccessTokenUseCase;
};

export default resolveRefreshAccessTokenUseCase; 