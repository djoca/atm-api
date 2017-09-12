import * as repository from "./accountRepository";
import * as atmService from "./atmService";
import { AccountNotFoundError, InsuficientBalanceError } from "./exception";

function deposit(accountId, bills, callback) {
    try {
        const account = getAccount(accountId);

        atmService.deposit(bills);

        let value = 0;

        bills.forEach((bill) => {
            value += bill.value * bill.quantity;
        });

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