
export type RecordList<TRecord> = { results: TRecord[]};

export type RangedRecordList<TRecord> = RecordList<TRecord> & { range: IRecordRange};

export type DatabaseRecord<Tdao> = Tdao&{id:string}

export type DatabaseFilter<Tdao> = Partial<DatabaseRecord<Tdao>>

export interface IDataAccessBoundary {}

/**
 * Range types
 */
export type IFilterRange = [number, number] // [offset, limit_inclusive] 
export type IRecordRange = [number, number, boolean] // [min_index, max_index, exhausted/finished] 
export const ONE_RECORD: IFilterRange = [0,0] // only record 0