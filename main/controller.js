import { routing } from "./routing";
import * as service from "./accountService";
import { AccountNotFoundError } from "./exception";

function deposit(request, response, route) {
    let body = "";

    request.on("data", function(data) {
        body += data;
    });

    request.on("end", function() {
        const bills = JSON.parse(body);

        const accountId = parseInt(route.parameters.id);

        service.deposit(accountId, bills, (account, err) => {
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

        service.withdraw(accountId, data.amount, (account, err) => {
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
