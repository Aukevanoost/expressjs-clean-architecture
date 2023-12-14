import asRoute from './mappers/route.mapper';
import { Router } from 'express';

import { IRouteSection } from '@plugins/router/router.boundary';
import { IAuthController } from '@adapter/web/auth.contracts';

const resolveAuthRoutes = (controller: IAuthController): IRouteSection => {
    const authRoutes = (router: Router) => {    
        const uri = 'auth';
                  
        router.route('/validate').get(asRoute(controller.validateAccessToken));   
        router.route('/refresh').get(asRoute(controller.refreshAccessToken));     
        router.route('/signin').post(asRoute(controller.signIn)); 
        router.route('/').delete(asRoute(controller.signOut));       
    
        return {uri, router};
    }

    return Object.freeze(authRoutes);
}
export default resolveAuthRoutes;