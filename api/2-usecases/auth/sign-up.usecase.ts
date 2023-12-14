import { User } from "@entities/user.model";

import { DatabaseRecord } from '@usecases/data-access';
import { UserDAO } from "@usecases/data-access/dao/user.dao";
import { IUserDataAccess } from "@usecases/data-access/user.boundaries";
import { IHashingBoundary } from "@usecases/security";
import { IUserInputSanitizer, IUserInputValidator } from "@usecases/security/user.boundaries";
import { UseCase } from "@usecases/usecases";
import { ISignUpUseCaseFactory, ISignUpUseCaseInput, ISignUpUseCaseOutput } from "@usecases/usecases/user.contracts";

import { DataAccessError } from "util/errors/data-access.error";


const resolveSignUpUseCase: ISignUpUseCaseFactory = (
    validationService: IUserInputValidator,
    sanitizationService: IUserInputSanitizer,
    hashingService: IHashingBoundary,
    userDataAccess: IUserDataAccess,
    userPresenter,
) => {

    /**
     * UseCase: sign-up
     * @param useCaseInput 
     * @returns viewmodel
     */
    const signUpUseCase = (useCaseInput: ISignUpUseCaseInput) => {

        const outputBoundary = UseCase.of(useCaseInput)
            .then(sanitizeUserInput)
            .then(validateUserInput)
            .then(hashPasswordOfUseCaseInput)
            .then(checkIfUserExists)
            .then(addUserToDatabase)
            .then(mapDAOToUseCaseOutput);
        
        return userPresenter(outputBoundary);
    }

    const validateUserInput = (useCaseInput: ISignUpUseCaseInput)
        : Promise<Required<ISignUpUseCaseInput>> => {
            return validationService.check(useCaseInput);
        }

    const sanitizeUserInput = (user: ISignUpUseCaseInput) 
        : Promise<ISignUpUseCaseInput> => { 
            return sanitizationService.clean(user); 
        }

    const hashPasswordOfUseCaseInput = (user: Required<ISignUpUseCaseInput>) 
        : Promise<Required<ISignUpUseCaseInput>> => {
            return hashingService
                .hash(user.password)
                .then(password => ({...user, password}))
        } 
    
    const checkIfUserExists = (user: Required<ISignUpUseCaseInput>)
        : Promise<Required<ISignUpUseCaseInput>> => {
            return userDataAccess
                .get({email: user.email})
                .then(matchingUsers => new Promise((resolve, reject) => {
                    if(matchingUsers.length > 0) return reject(new DataAccessError("Email address already in use"));
                    return resolve(user);
                }));
        }


    const addUserToDatabase = (user: Required<ISignUpUseCaseInput>)
        : Promise<DatabaseRecord<UserDAO>> => {
            return userDataAccess.add(user);
        }

    const mapDAOToUseCaseOutput = (dao: DatabaseRecord<UserDAO>)
        : ISignUpUseCaseOutput => {
            return {...dao}
        }

    return signUpUseCase;
};

export default resolveSignUpUseCase; 