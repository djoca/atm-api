import * as assert from "assert";
import { routing } from "../main/routing";
import * as http from "http";
import { server } from "../main/main";

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
        routing.register({
            path: "/test",
            method: "GET",
            func: f
        });

        assert.equal(routing.routes.length, 2);

        done();
    });

    it("should register a route for a different request method", (done) => {
        const p = function() {
            return {status: "posted"};
        }

        routing.register({
            path: "/test",
            method: "POST",
            func: p
        });

        assert.equal(routing.routes.length, 3);

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
        server.start();

        const req = http.request({
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/test"
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

});
