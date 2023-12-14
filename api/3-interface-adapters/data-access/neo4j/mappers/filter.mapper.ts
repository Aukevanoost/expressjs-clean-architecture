import { DatabaseFilter } from "@usecases/data-access";

export class Neo4jFilterMapper<T> {
    private constructor() {}

    public static of<T>() {return new Neo4jFilterMapper<T>()}
    
    public daoFilter(filter?: DatabaseFilter<T>, checkOnly?: Array<keyof T>): string {
        if(!filter || Object.keys(filter).length < 1) return "{}";
        return `{${this.toKeyValues("", filter , ":", checkOnly).join(', ')}}`;
    }

    public where(alias:string, filter?: DatabaseFilter<T>, checkOnly?: Array<keyof T>): string {
        const props = this.toKeyValues(alias, filter, "=", checkOnly).join(" AND ");
        return props.length > 0 ? `WHERE ${props}`: "";
    }

    public set(alias: string, filter?: DatabaseFilter<T>, updateOnly?: Array<keyof T>): string {
        const props = this.toKeyValues(alias, filter , "=", updateOnly).join(", ");
        return props.length > 0 ? `SET ${props}`: "";
    }

    private toKeyValues(alias: string, filter?: DatabaseFilter<T>, equalSign = "=",  props?: Array<keyof T>): string[] {
        if(!filter || Object.keys(filter).length < 1) return [];

        return Object.entries(filter ?? {})
            .filter(([key,_]) => (!this.isSet(props) || props?.includes(key as keyof T)))
            .map(([key, value]: [string, any]) => {
                const filterParam = (key === "id") 
                    ? `elementId(${alias})` 
                    : alias === "" ? key : `${alias}.${key}`; 
                return `${filterParam} ${equalSign} ${this.addQuotesIfString(value)}`;
            }, []);
    }

    private addQuotesIfString(value: any): string {
        return (typeof value === "string") ? `"${value}"` : value;
    }

    private isSet(set?: Array<any>) {
        return !!set && set.length > 0;
    }
}