import { Request, Response } from "express";
import { IMiddleWare } from ".";

const headersMiddleware: IMiddleWare = (req: Request, res: Response, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header('Access-Control-Expose-Headers', 'Content-Range'); 
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Range, Content-Type, Accept, Authorization, Range"
  );

  if(req.method === "OPTIONS") return res.sendStatus(200);

  next();
};

export default headersMiddleware;