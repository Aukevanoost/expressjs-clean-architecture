
type ISanitizationStrategy<T> = (dirty: T) => T;

export class Sanitizer<T> {
    private cleanInput: Partial<T> = {};

    private constructor(private dirty: T) {

    }

    public static from<T>(dirty: T) {
        return new Sanitizer<T>(dirty);
    }

    public sanitize(key: keyof T, strategy: ISanitizationStrategy<any>) {
        if(!!this.dirty[key]) {
            this.cleanInput[key] = strategy(this.dirty[key]);
        }
        return this;
    }

    public get() {return this.cleanInput; }
}


export default ISanitizationStrategy;