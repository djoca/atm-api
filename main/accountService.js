import * as repository from "./accountRepository";

const bill_values = {
    "one_brl_bill": 1,
    "two_brl_bill": 2,
    "five_brl_bill": 5,
    "ten_brl_bill": 10,
    "twenty_brl_bill": 20,
    "fifty_brl_bill": 50,
    "one_hundred_brl_bill": 100
};

function deposit(accountId, bills, callback) {
    let value = 0;

    for (let bill_type in bill_values) {
        value += bills[bill_type] ? bills[bill_type] * bill_values[bill_type] : 0;
    }

    const account = repository.get(accountId);

    account.deposit(value);

    repository.save(account);

    callback(account);
}

export { deposit };