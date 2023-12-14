import { IUseCase } from "@usecases/usecases";
import { IGetActiveAccountUseCaseInput, IGetSessionHistoryUseCaseInput, ISignUpUseCaseInput } from "@usecases/usecases/user.contracts";
import { IGetActiveAccountViewModel, IGetSessionHistoryViewModel, ISignUpViewModel } from "@adapter/web/user.contracts";

export type ISignUpUseCase = IUseCase<ISignUpUseCaseInput, ISignUpViewModel>

export type IGetSessionHistoryUseCase = IUseCase<IGetSessionHistoryUseCaseInput, IGetSessionHistoryViewModel>

export type IGetActiveAccountUseCase = IUseCase<IGetActiveAccountUseCaseInput, IGetActiveAccountViewModel>
