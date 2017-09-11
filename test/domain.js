import * as assert from "assert";
import { routing } from "../main/routing";
import { server } from "../main/server";

import * as http from "http";

describe("atm", () => {

    before(() => {
        server.start();
    })

    after(() => {
        server.stop();
    })

    it("should have end point", (done) => {
        const route = routing.get("/account/:id/deposit", "POST");
        assert.ok(route);
        done();
    });

    it ("should deposit 15 BRL with three 5 BRL bills", (done) => {

        const options = {
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/account/1001/deposit"
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
            method: "POST",
            path: "/account/1001/deposit"
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

    it ("should withdraw 70 BRL from account with sufficient balance", (done) => {
       const options = {
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/account/1002/withdrawal"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 200);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const result = JSON.parse(data);

                assert.equal(result.account.balance, 30);
                assert.equal(result.bills.fifty_brl_bill, 1);
                assert.equal(result.bills.twenty_brl_bill, 1);
                assert.ok(!result.bills.ten_brl_bill);
                done();
            });
        });

        const data = {
            amount: 70
        };

        req.write(JSON.stringify(data));

        req.end();
    });

    it ("should not withdraw from account with insufficient balance", (done) => {
       const options = {
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/account/1002/withdrawal"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 400);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                done();
            });
        });

        const data = {
            amount: 70
        };

        req.write(JSON.stringify(data));

        req.end();
    });

    it ("should not withdraw from account with invalid amount", (done) => {
       const options = {
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/account/1002/withdrawal"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 400);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                done();
            });
        });

        const data = {
            amount: "Not a number"
        };

        req.write(JSON.stringify(data));

        req.end();
    });

    it ("should return 404 for nonexistent account when depositing", (done) => {
       const options = {
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/account/1425/deposit"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 404);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
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

    it ("should return 404 for nonexistent account when withdrawing", (done) => {
       const options = {
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/account/1425/withdrawal"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 404);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                done();
            });
        });

        const data = {
            amount: 70
        };

        req.write(JSON.stringify(data));

        req.end();
    });


    it ("should not withdraw from account with insufficient amount of bills inside ATM", (done) => {
       const options = {
            hostname: "localhost",
            port: 9000,
            method: "POST",
            path: "/account/1003/withdrawal"
        };

        const req = http.request(options, (response) => {
            let data = "";

            assert.equal(response.statusCode, 503);

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                done();
            });
        });

        const data = {
            amount: 500
        };

        req.write(JSON.stringify(data));

        req.end();
    });
});