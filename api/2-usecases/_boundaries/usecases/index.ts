
/**
 * UseCase types
 */
export type IUseCase<TUseCaseInput, Tpresenter> = (useCaseInput: TUseCaseInput) => Tpresenter

export type ISimpleUseCase<Tviewmodel> = () => Tviewmodel

/**
 * UseCase input types
 */
export type IListUseCaseInput<Tfilter> = {user?: {id: string}, filter: Partial<Tfilter>, range: [number,number]};

/**
 * UseCase output types
 */
export type IListUseCaseOutput<Trecords> = {results: Trecords[],  range: [number,number, boolean]};

export type IPresenter<TuseCaseOutput, UpresentMapper> = (useCaseOutput: Promise<TuseCaseOutput>) => UpresentMapper;

export const UseCase: {of: <T>(useCaseInput: T) => Promise<T>} = {
    of: (useCaseInput) => new Promise(resolve => resolve(useCaseInput))
}