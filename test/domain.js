import * as assert from "assert";
import { routing } from "../main/routing";
import { server } from "../main/server";

import * as http from "http";

describe("deposit", () => {

    before(() => {
        server.start();
    })

    after(() => {
        server.stop();
    })

    it("should have end point", (done) => {
        const route = routing.get("/account/:id", "PUT");
        assert.ok(route);
        done();
    });

    it ("should deposit 15 BRL with three 5 BRL bills", (done) => {

        const options = {
            hostname: "localhost",
            port: 9000,
            method: "PUT",
            path: "/account/1001"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 200);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const account = JSON.parse(data);

                assert.equal(account.balance, 15);
                done();
            });
        });

        const data = {
            five_brl_bill: 3
        };

        req.write(JSON.stringify(data));

        req.end();
    });

    it ("should deposit 76 BRL with one 50 BRL bill, two 10 BRL bills and three 2 BRL bill", (done) => {

        const options = {
            hostname: "localhost",
            port: 9000,
            method: "PUT",
            path: "/account/1001"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 200);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const account = JSON.parse(data);

                assert.equal(account.balance, 15 + 76);
                done();
            });
        });

        const data = {
            fifty_brl_bill: 1,
            ten_brl_bill: 2,
            two_brl_bill: 3
        };

        req.write(JSON.stringify(data));

        req.end();
    });

});