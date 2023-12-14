
type IValidationStrategy<T> = (dirty: T) => boolean;

export default IValidationStrategy;