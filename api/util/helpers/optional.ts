
export class Optional<T> {

  private constructor(private item?: T) { }

  public static of<T>(item?: T): Optional<T>  {  return new Optional(item);  }
  public static empty<U>(): Optional<U>  {  return Optional.of<U>(undefined);  }

  public isPresent() {  return typeof this.item !== 'undefined' &&  this.item !== null }
  public set<U>(other: U) { Optional.of(other); }

  public ifPresent(callback: (item:T) => void): void {
    if(this.isPresent()) callback(this.item as T);
  }

  public map<U>(callback: (item: T) => U): Optional<U> {
    if(!this.isPresent()) return Optional.empty() as Optional<U>;

    return Optional.of(callback(this.item as T));
  }

  public orElse(other: Required<T>): NonNullable<T> {
    return (this.isPresent())
      ? this.item as NonNullable<T>
      : other  as NonNullable<T>;
  }

  public orThrow(error: Error|string): T {
    if(this.isPresent()) return this.item as T; 
    throw (typeof error === "string") ? new Error(error) : error;
  }

  public get(): T|undefined {
    return this.item;
  }
}
