import { server } from "../main/main";
import { get } from "http";

describe("server", () => {
    it("should start server at port 9000", (done) => {
        server.start();
        get("http://localhost:9000", (response) => {
            server.stop();
            done();
        });
    });
});