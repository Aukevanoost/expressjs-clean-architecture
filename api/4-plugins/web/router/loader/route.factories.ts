import authMiddleware from '@plugins-internal/web/middleware/auth.middleware';
import { IRouteSection, RouteSectionResolver, resolvedRouteSection } from '@plugins/router/router.boundary';
import express from 'express';

export const privateSectionResolver: RouteSectionResolver = (section: IRouteSection): resolvedRouteSection => {
    const router = express.Router();

    router.use(authMiddleware);
    
    return section(router);
}

export const publicSectionResolver: RouteSectionResolver = (section: IRouteSection): resolvedRouteSection  => {
    const router = express.Router();

    return section(router);
}