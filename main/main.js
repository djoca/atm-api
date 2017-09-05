import { createServer } from "http";

const defaultHeaders = {
    "Content-type": "application/json; charser=utf-8"
}

function requestListener(request, response) {
    response.writeHead(200, defaultHeaders);
    response.write(JSON.stringify({status:"ok"}));
    response.end();
};

function start() {
    const serverPort = 9000;

    createServer(requestListener).listen(serverPort);

    console.log("Server running at port %s", serverPort);
}

start();