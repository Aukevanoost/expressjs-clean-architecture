import { Response } from "express";

export type IViewModelResponse<Tviewmodel> = { 
    present: (res: Response) => Promise<{res: Response, body: Tviewmodel}> 
};
