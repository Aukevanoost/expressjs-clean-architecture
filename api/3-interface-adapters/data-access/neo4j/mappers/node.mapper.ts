import { DatabaseRecord } from "@usecases/data-access"

export class Neo4jNodeMapper<T> {
    private constructor() {}

    public static of<T>() {return new Neo4jNodeMapper<T>()}

    toList(alias: string, neo4jResult: any): DatabaseRecord<T>[] {
        return neo4jResult.records.map((record: any) => ({
            ...record.get(alias).properties,
            id: record.get(alias).elementId
        }))
    }

    toDAO(alias: string, neo4jResult: any): DatabaseRecord<T> {
        return {
            ...neo4jResult.records[0].get(alias).properties,
            id: neo4jResult.records[0].get(alias).elementId
        }
    }
}