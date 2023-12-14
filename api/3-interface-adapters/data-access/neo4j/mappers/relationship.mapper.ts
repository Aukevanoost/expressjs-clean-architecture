import { DatabaseRecord } from "@usecases/data-access"
import { DataAccessError } from "util/errors/data-access.error";

export class Neo4jRelationshipMapper<T,U> {
    private constructor() {}

    public static of<T,U>() {return new Neo4jRelationshipMapper<T,U>()}

    toChain(alias: string, neo4jResult: any): [DatabaseRecord<T>,DatabaseRecord<U>][] {
        
        return neo4jResult.records.map((record: any, idx: number) => {
            return this.mapRelationship(alias, record, idx)
        })
    }

    toList(alias: string, neo4jResult: any, injectPropsIntoT?: {[key: string]: string}): [DatabaseRecord<T>,DatabaseRecord<U>][] {    
        return neo4jResult.records.map((record: any) => {
            return this.mapRelationship(alias, record, 0, injectPropsIntoT)
        })
    }
    toManyToOneList(alias: string, neo4jResult: any, injectPropsIntoT?: {[key: string]: string}): [DatabaseRecord<T>[],DatabaseRecord<U>][] {    
        const newOneToManyEntry = (groupedBy: DatabaseRecord<U>): [DatabaseRecord<T>[],DatabaseRecord<U>] => [[], groupedBy];

        const hashmap_TgroupedbyU = neo4jResult.records.reduce((grouped:{[key:string]: [DatabaseRecord<T>[],DatabaseRecord<U>]}, record: any) => {
            const [entity,groupedBy] = this.mapRelationship(alias, record, 0, injectPropsIntoT);

            if(!grouped[groupedBy.id]) grouped[groupedBy.id] = newOneToManyEntry(groupedBy); 
            grouped[groupedBy.id][0].push(entity);

            return grouped;
        }, new Array<{[key:string]: [DatabaseRecord<T>[],DatabaseRecord<U>]}>());

        return Object.values(hashmap_TgroupedbyU);
    }

    toDAO(alias: string, neo4jResult: any, injectPropsIntoT?: {[key: string]: string}): [DatabaseRecord<T>,DatabaseRecord<U>] {
        if(!neo4jResult.records[0]) throw new DataAccessError("No records found");
        return this.mapRelationship(alias, neo4jResult.records[0], 0, injectPropsIntoT);
    }

    private mapRelationship(alias: string, record: any, segmentIdx: number, injectPropsIntoT?: {[key: string]: string}): [DatabaseRecord<T>,DatabaseRecord<U>] {

        const entity = {
            ...record.get(alias).segments[segmentIdx].start.properties,
            id: record.get(alias).segments[segmentIdx].start.elementId
        }
        if(!!injectPropsIntoT) {
            Object.entries(injectPropsIntoT).forEach(([tag,column]) => {
                entity[tag] = record.get(column);
            });
        }

        const dependant = { 
            ...record.get(alias).segments[segmentIdx].relationship.properties,
            ...record.get(alias).segments[segmentIdx].end.properties,
            id: record.get(alias).segments[segmentIdx].end.elementId
        }

        return [entity, dependant];
    }
}