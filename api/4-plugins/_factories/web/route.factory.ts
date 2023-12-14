import controllerFactory from "@adapter-factories/web/controller.factory";
import authMiddleware from "@plugins-internal/web/middleware/auth.middleware";
import resolveAuthRoutes from "@plugins-internal/web/router/auth.routes";
import resolveUserRoutes from "@plugins-internal/web/router/user.routes";
import { IRouteSection } from "@plugins/router/router.boundary";

const routeFactory = {
    authSection: (): IRouteSection => {
        return resolveAuthRoutes(
            controllerFactory.authController(),
        );
    },

    userSection: (): IRouteSection => {
        return resolveUserRoutes(
            controllerFactory.userController(),
            authMiddleware
        );
    },
}

export default routeFactory;