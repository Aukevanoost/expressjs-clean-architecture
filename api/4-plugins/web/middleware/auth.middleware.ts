import controllerFactory from "@adapter-factories/web/controller.factory";
import { errorResponse } from "../router/mappers/response.mapper";
import { Response, Request } from "express";
import requestMapper from "../router/mappers/request.mapper";
import { IMiddleWare } from ".";


const authMiddleware: IMiddleWare =  (req: Request, res: Response, next: any)  => {  
  const controller = controllerFactory.authController();
  const errorHandler = errorResponse(res);

  controller
    .validateAccessToken(requestMapper(req))
    .present(res)
    .then(({body}) => {
      (req as any).user = {id: body.user.id, email: body.user.email};
      next();
    })
    .catch(err => errorHandler(err));
};

export default authMiddleware;