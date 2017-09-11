import { Account } from "./account";

const savedAccounts = new Map();

save(new Account(1001));
save(new Account(1002, 100));

function get(id) {
    return savedAccounts.get(id);
}

function save(account) {
    savedAccounts.set(account.id, account);
}

export { get, save };
