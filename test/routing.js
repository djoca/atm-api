import * as assert from "assert";
import { routing } from "../main/routing";
import * as http from "http";
import { server } from "../main/server";

describe("routing", () => {

    const f = function() {
        return "{status: 'ok'}";
    }

    it("should register a new route", (done) => {
        routing.register({
            path: "/",
            func: f
        });

        done();
    });

    it("should register another route", (done) => {
        const numRoutes = routing.routes.length;

        routing.register({
            path: "/test",
            method: "GET",
            func: f
        });

        assert.equal(routing.routes.length, numRoutes + 1);

        done();
    });

    it("should register a route for a different request method", (done) => {
        const p = function() {
            return {status: "posted"};
        }

        const numRoutes = routing.routes.length;

        routing.register({
            path: "/test",
            method: "POST",
            func: p
        });

        assert.equal(routing.routes.length, numRoutes + 1);

        const route = routing.get("/test", "POST");
        assert.equal(route.path, "/test");
        assert.equal(route.method, "POST");
        assert.equal(route.func, p);
        assert.equal(JSON.stringify(route.func()), '{"status":"posted"}');
        done();
    });

    it("should find a route", (done) => {
        const route = routing.get("/");
        assert.equal(route.path, "/");
        assert.equal(route.func, f);
        done();
    });

    it("should call the route function", (done) => {
        const result = routing.get("/").func();
        assert.equal("{status: 'ok'}", result);
        done();
    });

    it("should be called by the http server", (done) => {
        const anotherTest = function(request, response) {
            const result = {status: "posted"};

            response.write(JSON.stringify(result));
            response.end();
        }

        const numRoutes = routing.routes.length;

        routing.register({
            path: "/another-test",
            method: "POST",
            func: anotherTest
        });

        server.start();

        const req = http.request({
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/another-test"
        }, (response) => {
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                server.stop();
                assert.equal(data, '{"status":"posted"}');
                done();
            });
        });

        req.end();
    });

    it("should return 404 if route not found", (done) => {
        server.start();

        http.get("http://localhost:9000/notfound", (response) => {
            server.stop();
            assert.equal(response.statusCode, 404);
            done();
        })
    });

    it("should find routing with parameter", (done) => {
        routing.register({
            path: "/book/:id",
            method: "DELETE"
        });

        const route = routing.get("/book/10", "DELETE");

        assert.ok(route);

        done();
    });

    it("should extract params from path", (done) => {
        routing.register({
            path: "/book/:id/chapter/:chapterNumber",
            method: "PUT"
        });

        const route = routing.get("/book/10/chapter/3", "PUT");

        assert.equal(route.parameters.id, 10);
        assert.equal(route.parameters.chapterNumber, 3);

        done();
    });
});
