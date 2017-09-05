import { createServer } from "http";

const defaultHeaders = {
   "Content-type": "application/json; charser=utf-8"
};

class Server {

    constructor(serverPort) {
        this.serverPort = serverPort;
        this.server = createServer(this.requestListener);
    }

    requestListener(request, response) {
        response.writeHead(200, defaultHeaders);
        response.write(JSON.stringify({status:"ok"}));
        response.end();
    }

    start() {
        this.server.listen(this.serverPort);
        console.log("Server running at port %s", this.serverPort);
    }

    stop() {
        this.server.close();
    }

}

const server = new Server(9000);
server.start();

export { server };