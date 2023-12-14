import { Router } from "express";


export type IRouteSection = (router: Router) => { uri: string, router: Router };

export type resolvedRouteSection = { uri: string, router: Router };

export type RouteSectionResolver = (section :IRouteSection) => resolvedRouteSection;
