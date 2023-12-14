import { User } from "@entities/user.model";
import { IUserDataAccess } from "@usecases/data-access/user.boundaries";
import { UseCase } from "@usecases/usecases";
import { IGetActiveAccountUseCaseFactory, IGetActiveAccountUseCaseInput, IGetActiveAccountUseCaseOutput} from "@usecases/usecases/user.contracts";
import { AuthenticationError } from "util/errors/authentication.error";
import { DataAccessError } from "util/errors/data-access.error";

const resolveGetActiveAccountUseCase: IGetActiveAccountUseCaseFactory = (
    userDataAccess: IUserDataAccess,
    presenter,
) => {

    /**
     * UseCase: get-account-by-token
     * @param useCaseInput 
     * @returns viewmodel
     */
    const GetActiveAccountUseCase = (useCaseInput: IGetActiveAccountUseCaseInput) => {
        const output = UseCase.of(useCaseInput)
            .then(checkAuthentication)
            .then(getUserByID)
            .then(mapToUseCaseOutput)
            
        return presenter(output);
    }

    const checkAuthentication = ({user}: IGetActiveAccountUseCaseInput)
        : Promise<IGetActiveAccountUseCaseInput>  => {
            return new Promise((resolve) => {
                if(!user) throw new AuthenticationError("User not authenticated");
                resolve({user})
            })
        }

    const getUserByID = ({user}: IGetActiveAccountUseCaseInput) 
        : Promise<User> => {
            return userDataAccess.get({id: user!.id})
                .then((users) => {
                    if(users.length !== 1) throw new DataAccessError("Could not find user."); 
                    return users[0];
                })
        }

    const mapToUseCaseOutput = (account: User)
        : IGetActiveAccountUseCaseOutput => {
            return {account};
        }

    return GetActiveAccountUseCase;
};

export default resolveGetActiveAccountUseCase; 