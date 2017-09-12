import * as repository from "./accountRepository";
import { AccountNotFoundError, InsuficientBalanceError } from "./exception";

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

    try {
        const account = getAccount(accountId);

        account.deposit(value);

        repository.save(account);

        callback(account);
    } catch (err) {
        callback(null, err);
    }
}

function reversal(accountId, amount) {
    const account = getAccount(accountId);

    account.deposit(amount);

    repository.save(account);
}

function canWithdraw(accountId, amount, callback) {
    try {
        const account = getAccount(accountId);

        if (amount > account.balance) {
            throw new InsuficientBalanceError();
        }

        callback();
    } catch (err) {
        callback(err);
    }
}

function withdraw(accountId, amount, callback) {
    try {
        const account = getAccount(accountId);

        account.withdraw(amount);

        repository.save(account);

        callback(account);
    } catch (err) {
        callback(null, err);
    }
}

function getAccount(accountId) {
    const account = repository.get(accountId);

    if (!account) {
        throw new AccountNotFoundError();
    }

    return account;
}

export { deposit, withdraw, canWithdraw, reversal };