import { routing } from "./routing";

function deposit(request, response) {

}

routing.register({
    path: "/deposit",
    method: "POST",
    func: deposit
});