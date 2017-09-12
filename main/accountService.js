import * as repository from "./accountRepository";
import * as atmService from "./atmService";
import { AccountNotFoundError, InsuficientBalanceError } from "./exception";

function deposit(accountId, bills, callback) {
    getAccount(accountId, (account, err) => {

        if (err) {
            callback(null, err);
            return;
        }

        atmService.deposit(bills, () => {
            let value = 0;

            bills.forEach((bill) => {
                value += bill.value * bill.quantity;
            });

            account.deposit(value);

            repository.save(account, () => {
                callback(account, err);
            });

        });
    });
}

function reversal(accountId, amount) {
    getAccount(accountId, (account, err) => {

        account.deposit(amount);

        repository.save(account, () => {});
    });
}

function canWithdraw(accountId, amount, callback) {
    getAccount(accountId, (account, err) => {

        if (err) {
            callback(err);
            return;
        }

        if (amount > account.balance) {
            callback(new InsuficientBalanceError());
        } else {
            callback();
        }

    });
}

function withdraw(accountId, amount, callback) {
    getAccount(accountId, (account, err) => {
        try {
            account.withdraw(amount);

            repository.save(account, () => {
                callback(account, err);
            });

        } catch (err) {
            callback(null, err);
        }
    });
}

function getAccount(accountId, callback) {
    repository.get(accountId, (account, err) => {
        if (!account) {
            callback(null, new AccountNotFoundError());
        } else {
            callback(account);
        }
    });
}

export { deposit, withdraw, canWithdraw, reversal };