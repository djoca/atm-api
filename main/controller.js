import { routing } from "./routing";

function deposit(request, response) {
}

routing.register({
    path: "/account/:id",
    method: "POST",
    func: deposit
});
