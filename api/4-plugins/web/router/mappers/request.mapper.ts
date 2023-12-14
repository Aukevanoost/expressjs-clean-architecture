import { RestRequest } from "@adapter-internal/web/rest-request";
import { Request } from "express";
import Environment from "util/environment";

export default (req: Request): RestRequest => {
return {
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip as string,
    method: req.method,
    //path: req.path,
    user: (req as any).user,
    //logger: req.logger,
    //source: {
    //ip: req.ip,
    //browser: req.get('User-Agent')
    //},
    headers: {
        authorization: req.get('authorization'),
        range: reqRangeMapper(req.get('range') ),
    //Referer: req.get('referer'),
    //'User-Agent': req.get('User-Agent')
    }
}};

const reqRangeMapper = (input?: string): [number,number] => {
    const customRange = /^items=([0-9]+)-([0-9]+)$/gi.exec(input ?? '');
    if(customRange !== null) {
        return [Number(customRange[1]),Number(customRange[2])];
    }    

    const defaultMax = Environment.get('RECORD_FETCH_HARD_LIMIT')
        .map(x => isNaN(Number(x)) ? undefined : Number(x))
        .orElse(25);
    return [0,defaultMax];
}