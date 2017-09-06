class Routing {
    constructor() {
        this.routes = [];
    }

    register(route) {
        console.log("Registering route '%s'", JSON.stringify(route));
        this.routes.push(route);
    }

    get(path, method) {
        return this.routes.find(r => r.path === path && r.method === method);
    }

}

const routing = new Routing();

export { routing };