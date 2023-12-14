import headersMiddleware from './headers.middleware';
import {Express} from "express";
import bodyParser from 'body-parser';
import { Response, Request } from "express";

export type IMiddleWare = (req: Request, res: Response, next: any) => void;

const middlewareFactory = (app: Express): Express => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(headersMiddleware);

    return app;
}

export default middlewareFactory;