import * as assert from "assert";
import { routing } from "../main/routing";

describe("deposit", () => {

    it("should have end point", (done) => {
        const route = routing.get("/account/:id", "POST");
        assert.ok(route);
        done();
    });

});