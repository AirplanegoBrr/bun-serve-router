import { URLPattern } from "urlpattern-polyfill";

class Route {
    constructor(
        public method: string,
        public urlPattern: URLPattern,
        public handler: Handler
    ) { }
}

type Handler = (request: Request, params: URLPatternResultParams, urlPatternResult: URLPatternResult) => Response | Promise<Response>


export class Router {
    private routeList: Route[] = [];

    add(method: string, pattern: string, handler: Handler): void {
        method = method.toUpperCase();
        const RoutePattern = new URLPattern({ pathname: pattern });
        const route = new Route(method, RoutePattern, handler);
        this.routeList.push(route);
    }

    get(pattern: string, handler: Handler): void {
        this.add("get", pattern, handler);
    }
    put(pattern: string, handler: Handler): void {
        this.add("put", pattern, handler);
    }
    post(pattern: string, handler: Handler): void {
        this.add("post", pattern, handler);
    }
    delete(pattern: string, handler: Handler): void {
        this.add("delete", pattern, handler);
    }
    patch(pattern: string, handler: Handler): void {
        this.add("patch", pattern, handler);
    }
    head(pattern: string, handler: Handler): void {
        this.add("head", pattern, handler);
    }
    options(pattern: string, handler: Handler): void {
        this.add("options", pattern, handler);
    }
    trace(pattern: string, handler: Handler): void {
        this.add("trace", pattern, handler);
    }

    async match(request: Request) {
        for (const route of this.routeList) {
            if (request.method === route.method) {
                const result = route.urlPattern.exec(request.url);
                if (result) {
                    let r = route.handler(request, result.pathname.groups, result);

                    if (r instanceof Response) {
                        return r;
                    } else {
                        return await r;
                    }
                }
            }
        }
    }
}

export type URLPatternResultParams = { [key: string]: string | undefined; };
