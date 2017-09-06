class Routing {
    constructor() {
        this.routes = [];
    }

    register(route) {
        console.log("Registering route '%s'", JSON.stringify(route));
        this.routes.push(route);
    }

    get(path, method) {
        const route = this.routes.find(r => this._match(r.path,path) && r.method === method);
        if (route) {
            route.parameters = this._parameters(route, path);
        }
        return route;
    }

    _match(normalizedPath, requestedPath) {

        if (!normalizedPath) {
            return false;
        }

        if (!requestedPath) {
            return false;
        }

        const normalized = normalizedPath.split("/");
        const requested = requestedPath.split("/");

        if (normalized.length != requested.length) {
            return false;
        }

        for (let i = 0; i < normalized.length; i++) {
            if (normalized[i] != requested[i] && !normalized[i].startsWith(":")) {
                return false;
            }
        }

        return true;
    }

    _parameters(route, path) {
        const pathArray = path.split("/");
        const routePathArray = route.path.split("/");
        const params = {};

        for (let i = 0; i < routePathArray.length; i++) {
            if (routePathArray[i].startsWith(":")) {
                params[routePathArray[i].substring(1)] = pathArray[i];
            }
        }

        return params;
    }

}

const routing = new Routing();

export { routing };