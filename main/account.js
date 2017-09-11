import { InsuficientBalanceError, InvalidAmountError } from "./exception";

function validateAmount(amount) {
    if (!(parseInt(amount) >= 0)) {
        throw new InvalidAmountError("Invalid amount: %s", amount);
    }
}

class Account {
    constructor(id, balance = 0) {
        this._id = id;
        this._balance = balance;
    }

    get id() { return this._id; }

    get balance() { return this._balance; }

    deposit(amount) {
        validateAmount(amount);

        this._balance += amount;
    }

    withdraw(amount) {
        validateAmount(amount);

        if (this._balance - amount < 0) {
            throw new InsuficientBalanceError();
        }

        this._balance -= amount;
    }

    toJSON() {
        return {
            id: this._id,
            balance: this._balance
        }
    }
}

export { Account };