import { routing } from "./routing";
import * as service from "./accountService";

function deposit(request, response, route) {
    let body = "";

    request.on("data", function(data) {
        body += data;
    });

    request.on("end", function() {
        const bills = JSON.parse(body);

        const accountId = parseInt(route.parameters.id);

        service.deposit(accountId, bills, (account) => {
            response.write(JSON.stringify(account));
            response.end();
        });
    });
}

routing.register({
    path: "/account/:id",
    method: "POST",
    func: deposit
});
