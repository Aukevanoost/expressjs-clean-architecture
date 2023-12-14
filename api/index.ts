import routeFactory from '@plugins-internal/_factories/web/route.factory';
import middlewareFactory from '@plugins-internal/web/middleware';
import RouteLoader from '@plugins-internal/web/router/loader/route.loader';
import express from 'express';
import Environment from 'util/environment';

const app = RouteLoader
    .into( middlewareFactory(express()) )
    .public([ 
      routeFactory.authSection(), 
      routeFactory.userSection() 
    ])
    .private([])
    .finish();

const port = Environment.get('PORT').orElse("3000");

app.listen(port, () => {
  console.log(`🍝 Backend is cooked and ready for action (port:${port}) 🍝`)
})

export default app;