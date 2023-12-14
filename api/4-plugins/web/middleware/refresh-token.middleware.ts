import controllerFactory from "@adapter-factories/web/controller.factory";
import { errorResponse } from "../router/mappers/response.mapper";
import { Response, Request } from "express";
import requestMapper from "../router/mappers/request.mapper";

export default (req: Request, res: Response, next: any) => {  
  const controller = controllerFactory.authController();
  const errorHandler = errorResponse(res);

  controller
    .validateRefreshToken(requestMapper(req))
    .present(res)
    .then(_ => next())
    .catch(err => errorHandler(err));
};