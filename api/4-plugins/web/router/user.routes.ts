import { IRouteSection } from './../../_boundaries/router/router.boundary';
import asRoute from './mappers/route.mapper';
import { Router } from 'express';

import { IMiddleWare } from '../middleware';
import { IUserController } from '@adapter/web/user.contracts';

const resolveUserRoutes = (controller: IUserController, authGuard: IMiddleWare): IRouteSection => {

    const userRoutes = (router: Router) => {
        /**
         * Public section
         */
        router.route('/').put(asRoute(controller.signUp));   
    
        /**
         * Private section
         */
        router.use(authGuard);
    
        router.route('/history').get(asRoute(controller.getSessionHistory));        
        router.route('/me').get(asRoute(controller.getMyActiveAccount));        
    
        return {uri: 'user', router};
    }

    return Object.freeze(userRoutes);
}
export default resolveUserRoutes;