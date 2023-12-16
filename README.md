# Clean architecture

Clean architecture from a purist perspective without violating any boundaries. 

## Structure

**1. Entities**
- Domain entities

**2. UseCases**
- Contracts (Interfaces) for data-access, security and web
- Implementation Use Cases

**3. Interfaces**
- Factories for Use Cases, data-access, security and controllers
- 'duck-type' interfaces for the UseCases*
- Contracts (interfaces) for presenters and viewmodels
- Implementation data-access, security and controllers
- Mappers

**4. Plugins**
- Factories for routers
- Contracts (interfaces) for routers
- Implementations Routers
- MiddleWare

**Utils**
- Contracts (interfaces) for Exceptions
- Helper classes
- Environment

**These UseCase interfaces serve only to help the UseCaseFactory with inferring the right presenter, this interface will not be used by the use-case layer.*  

## Problem 1: IoC, How to design the presenters.
The biggest challenge was designing the presenters without violating the boundaries. Inheritance is used to append the present function to the UseCaseOutput. 

The UseCase will return an object that looks a bit like this: 
```
(output: UseCaseOutput) => {/* nothing */}
```

That is why the UseCaseFactory uses a generic inference to defer the implementation of the viewmodel to the outer layer. 

```
export type IUseCaseFactory = <Tviewmodel> (
    /* services */
    presenter: IPresenter<IUseCaseOutput, Tviewmodel>,
) => IUseCase<IUseCaseInput, Tviewmodel>
```

The controller factory will use the specific implementation of the presenter to add the present function to the UseCase without having to use it, the controller will not return the ViewModel but the complete presenter

```
// Contracts
export type IViewModel = IViewModelResponse<{
    /* Output */
}>;

export type IPresenter = IPresenter<IUseCaseOutput,ISignUpViewModel>

// Factories
export const presenterFactory = {
    presenter: (): IPresenter => presenterImpl
}

const xyzUseCaseFactory = (): IUseCase => {
    return resolveUseCase(
        /* Injected services */
        presenterFactory.presenter()
    );
}
```

This way the implementation stays hidden from the usecase but the use case is able to return a partial callback. 



## Influences (Credits)
- [Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Neo4j Connection](https://github.com/neo4j-examples/neo4j-movies-template/blob/master/api/app.js)
- [Merlino implementation of clean architecture](https://merlino.agency/blog/clean-architecture-in-express-js-applications)
