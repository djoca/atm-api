import { createServer } from "http";
import { routing } from "./routing";
import * as url from "url";
import * as controller from "./controller";

const defaultHeaders = {
   "Content-type": "application/json; charser=utf-8"
};

class Server {

    constructor(serverPort) {
        this.serverPort = serverPort;
        this.server = createServer(this.requestListener);
    }

    requestListener(request, response) {
        const requestData = url.parse(request.url);

        const route = routing.get(requestData.pathname, request.method);

        response.setHeader("Content-type", "application/json; charser=utf-8");
        if (route) {
            response.statusCode = 200;
            route.func(request, response, route);
        } else {
            response.statusCode = 404;
            response.end();
        }
    }

    start() {
        this.server.listen(this.serverPort);
        console.log("Server running at port %s", this.serverPort);
    }

    stop() {
        console.log("Shutting down server.");
        this.server.close();
    }

}

const server = new Server(9000);

export { server };