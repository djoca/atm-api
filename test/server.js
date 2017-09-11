import { server } from "../main/server";
import { get } from "http";
import * as assert from "assert";

describe("server", () => {
    it("should start server at port 9000", (done) => {
        server.start();
        get("http://localhost:9000", (message) => {
            done();
        });
    });

    it("should return application-json", (done) => {
        get("http://localhost:9000", (message) => {
            assert.equal(message.headers["content-type"], "application/json; charser=utf-8");
            done();
        });
    });
    
    it("should stop server", (done) => {
        server.stop();

        const req = get("http://localhost:9000");

        req.on("error", (e) => {
            assert.equal(e.code, "ECONNREFUSED");
            done();
        });
    });
});