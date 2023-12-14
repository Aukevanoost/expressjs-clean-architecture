import { errorResponse, successResponse } from "./response.mapper";
import mapToRequest from './request.mapper';
import { RestRequest } from "@adapter-internal/web/rest-request";
import { Request, Response } from "express";

export type ControllerAction<Tviewmodel> = (req: RestRequest) => { present: (res: Response) => Promise<{res: Response, body: Tviewmodel}> };

export default <TViewModel> (controllerAction: ControllerAction<TViewModel>) => (req: Request, res: Response) => {
    controllerAction(mapToRequest(req))
        .present(res)
        .then(successResponse)
        .catch(errorResponse(res));
};