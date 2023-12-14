import { ISessionDataAccess } from "@usecases/data-access/session.boundaries";
import { UseCase } from "@usecases/usecases";
import { IGetSessionHistoryUseCaseFactory, IGetSessionHistoryUseCaseInput, IGetSessionHistoryUseCaseOutput} from "@usecases/usecases/user.contracts";
import { AuthenticationError } from "util/errors/authentication.error";

const resolveGetSessionHistoryUseCase: IGetSessionHistoryUseCaseFactory = (
    sessionDataAccess: ISessionDataAccess,
    presenter,
) => {

    /**
     * UseCase: get-session-history
     * @param useCaseInput 
     * @returns viewmodel
     */
    const getSessionHistoryUseCase = (useCaseInput: IGetSessionHistoryUseCaseInput) => {
        const output = UseCase.of(useCaseInput)
            .then(checkAuthentication)
            .then(getSessionsFromUser)
            
        return presenter(output);
    }

    const checkAuthentication = ({range, user}: IGetSessionHistoryUseCaseInput)
        : Promise<IGetSessionHistoryUseCaseInput> => {
            return new Promise<IGetSessionHistoryUseCaseInput>((resolve) => {
                if(!user) throw new AuthenticationError("User not authenticated");
                resolve({range, user})
            })
        }

    const getSessionsFromUser = ({range, user}: IGetSessionHistoryUseCaseInput)
        : Promise<IGetSessionHistoryUseCaseOutput> => {
            return sessionDataAccess.historyByUser(range, user!.id);
        }
            

    return getSessionHistoryUseCase;
};

export default resolveGetSessionHistoryUseCase; 