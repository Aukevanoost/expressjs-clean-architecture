import { ApplicationError } from "util/errors";
import { Response } from "express";

export const successResponse = ({res, body}: {res: Response, body: any}) =>  {
    res.set('Content-Type', 'application/json');
    res.type('json');

    res.status(200).json(body);
}

export const errorResponse = (res: Response) => <TError extends ApplicationError>(e: TError) =>  {
    if(!!e.errorType) {
        let errorCode;
        switch(e.errorType) {
            case 'authentication': errorCode = 401; break;
            case 'not-found': errorCode = 404; break;
            default: errorCode = 400; break;
        }
        
        return res.status(errorCode).send({  
            type: e.errorType,
            message: e.message 
        });
    }

    console.warn(e);
    res.status(500).send({
        success: false,
        code: 500,
        body: { 
            type: "unchecked",
            description: 'Something went terribly wrong!' 
        }
    });
}