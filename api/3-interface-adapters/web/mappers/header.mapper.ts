import { Response } from 'express';
import { RestRequest } from './../rest-request';
import { IRecordRange } from '@usecases/data-access';


const ContentRange = (res: Response, entity: string, [offset,items,exhausted]: IRecordRange): Response => {
    const total = !exhausted || items < offset ? '*' : items + 1;
    res.appendHeader('Content-Range', `${entity} ${`${offset}-${items}/${total}`}`)
    return res;
}

const Token = (req: RestRequest): string|undefined => {
    return req?.headers?.authorization?.split(' ')[1];
}

const headerMapper = {
    ContentRange,
    Token
}
export default headerMapper;