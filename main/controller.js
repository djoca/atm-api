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

        accountService.canWithdraw(accountId, data.amount, (err) => {
            if (err) {
                errorResponse(err, response);
                return;
            }

            accountService.withdraw(accountId, data.amount, (account, err) => {
                if (err) {
                    errorResponse(err, response);
                    return;
                }

                atmService.withdraw(data.amount, (bills, err) => {
                    if (err) {
                        accountService.reversal(accountId, data.amount);
                        errorResponse(err, response);
                        return;
                    }

                    response.statusCode = 200;

                    result.account = account;
                    result.bills = bills;

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

routing.register({
    path: "/account/:id/deposit",
    method: "POST",
    func: deposit
});

routing.register({
    path: "/account/:id/withdrawal",
    method: "POST",
    func: withdraw
});
