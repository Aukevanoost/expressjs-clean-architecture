import { Express } from 'express';
import { privateSectionResolver, publicSectionResolver } from './route.factories';
import { IRouteSection, RouteSectionResolver } from '@plugins/router/router.boundary';

class RouteLoader {
    private constructor(private app: Express) { }

    public static into(app: Express) {
        return new RouteLoader(app);
    }

    public public(routers: IRouteSection | IRouteSection[]) {
        return this.load(routers, publicSectionResolver);
    }

    public private(routers: IRouteSection | IRouteSection[]) {
        return this.load(routers, privateSectionResolver);
    }

    public load(routers: IRouteSection | IRouteSection[], resolver: RouteSectionResolver) {
        if(!Array.isArray(routers)) routers = [routers];

        routers.forEach((section:IRouteSection) => {
            const {uri, router} = resolver(section);
            this.app.use(`/${uri}`, router);
        })

        return this;
    }

    public finish(): Express {
        return this.app;
    }
}

export default RouteLoader;