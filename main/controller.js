import { routing } from "./routing";
import * as accountService from "./accountService";
import * as atmService from "./atmService";
import { AccountNotFoundError } from "./exception";

function deposit(request, response, route) {
    let body = "";

    request.on("data", function(data) {
        body += data;
    });

    request.on("end", function() {
        const bills = JSON.parse(body);

        const accountId = parseInt(route.parameters.id);

        accountService.deposit(accountId, bills, (account, err) => {
            if (err) {
                response.statusCode = err.code;
                response.write(JSON.stringify({
                    exception: err.message
                }));
                response.end();
            } else {
                response.statusCode = 200;
                response.write(JSON.stringify(account));
                response.end();
            }
        });
    });
}

function withdraw(request, response, route) {
    let body = "";

    request.on("data", function(data) {
        body += data;
    });

    request.on("end", function() {
        const data = JSON.parse(body);

        const accountId = parseInt(route.parameters.id);

        let result = {};

        const amount = parseInt(data.amount);

        accountService.canWithdraw(accountId, amount, (err) => {
            if (err) {
                errorResponse(err, response);
                return;
            }
            accountService.withdraw(accountId, amount, (account, err) => {
                if (err) {
                    errorResponse(err, response);
                    return;
                }

                atmService.withdraw(amount, (bills, err) => {
                    if (err) {
                        accountService.reversal(accountId, amount);
                        errorResponse(err, response);
                        return;
                    }

                    response.statusCode = 200;

                    result.account = account;
                    result.bills = bills.filter((bill) => bill.quantity);

                    response.write(JSON.stringify(result));
                    response.end();
                });
            });
        });
    });
}

function errorResponse(err, response) {
    if (err.code) {
        response.statusCode = err.code;
        response.write(JSON.stringify({
            exception: err.message
        }));
        response.end();
    } else {
        console.log(err);
    }
}

function cors(err, response) {
    response.statusCode = 200;
    response.end();
}

routing.register({
    path: "/account/:id/deposit",
    method: "POST",
    func: deposit
});

routing.register({
    path: "/account/:id/deposit",
    method: "OPTIONS",
    func: cors
});

routing.register({
    path: "/account/:id/withdrawal",
    method: "POST",
    func: withdraw
});

routing.register({
    path: "/account/:id/withdrawal",
    method: "OPTIONS",
    func: cors
});