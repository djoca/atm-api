const savedAccounts = new Map();

save({
    id: 1001,
    balance: 0
});

save({
    id: 1002,
    balance: 100
});

function get(id) {
    return savedAccounts.get(id);
}

function save(account) {
    savedAccounts.set(account.id, account);
}

export { get, save };
