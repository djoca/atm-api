import * as assert from "assert";
import { routing } from "../main/routing";

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
            func: f
        });

        assert.equal(routing.routes.length, 2);

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

});
