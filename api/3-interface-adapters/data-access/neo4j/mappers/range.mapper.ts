import { IFilterRange, IRecordRange } from "@usecases/data-access";


export const rangeMapper = (range: [number, number], results: number): IRecordRange => [
    range[0],
    range[0] + (results-1),
    range[0] + results <= range[1] // exhausted
]

export const addSkipAndLimit = ([offset, max]: IFilterRange): string => {
    const limit = (max - offset) + 1;
    return `SKIP ${offset} LIMIT ${limit}`;
}