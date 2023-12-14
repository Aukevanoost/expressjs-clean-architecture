import { User } from '@entities/user.model';
import { IUserDataAccess } from '@usecases/data-access/user.boundaries';
import { IJWTBoundary, IJWTBoundaryOutput } from '@usecases/security';
import { ISessionInputSanitizer } from '@usecases/security/session.boundaries';
import { UseCase } from '@usecases/usecases';
import { IValidateTokenUseCaseFactory, IValidateTokenUseCaseInput, IValidateTokenUseCaseOutput } from "@usecases/usecases/auth.contracts";
import { AuthenticationError } from 'util/errors/authentication.error';

const resolveValidateTokenUseCase: IValidateTokenUseCaseFactory = (
    sessionSanitizer: ISessionInputSanitizer,
    jwtService: IJWTBoundary,
    userDataAccess: IUserDataAccess,
    authPresenter,
) => {

    /**
     * UseCase: validate-token
     * @param useCaseInput 
     * @returns viewmodel
     */
    const ValidateTokenUseCase = (useCaseInput: IValidateTokenUseCaseInput) => {

        const output = UseCase.of(useCaseInput)
            .then(sanitizeSessionInput)
            .then(verifyToken)
            .then(checkIfTokenIsActive);
        
        return authPresenter(output);
    }

    const sanitizeSessionInput = ({token, type}: IValidateTokenUseCaseInput) 
        : Promise<IValidateTokenUseCaseInput> => {
            return sessionSanitizer.clean({token}).then(clean => ({type, token: clean.token}));
        }

    const verifyToken = ({type, token}: IValidateTokenUseCaseInput)
        : Promise<IJWTBoundaryOutput> => {
            return jwtService.verify(token, {type})
        };

    const checkIfTokenIsActive = ({token, body}: Required<IJWTBoundaryOutput>)
        : Promise<IValidateTokenUseCaseOutput> => {
            return userDataAccess
                .getWithLastSession({ session: {[body.type]: body.id}})
                .then((dao) => {
                    if(!dao[0].session) throw new AuthenticationError("No active access token found.");  
                    if(jwtService.isExpired(dao[0].session.expires)) throw new AuthenticationError("Token is expired.") 
                    return {token, user: dao[0].user};
                })
        }
    
    return ValidateTokenUseCase;
};

export default resolveValidateTokenUseCase; 