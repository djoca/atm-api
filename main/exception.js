class AccountNotFoundError extends Error {
    constructor(message) {
        super(message || "Account not found");
        Error.captureStackTrace(this, AccountNotFoundError);
        this.code = 404;
    }
}

class InsuficientBalanceError extends Error {
    constructor(message) {
        super(message || "Insuficient balance");
        Error.captureStackTrace(this, InsuficientBalanceError);
        this.code = 403;
    }
}

class InvalidAmountError extends Error {
    constructor(message) {
        super(message || "Invalid amount");
        Error.captureStackTrace(this, InsuficientBalanceError);
        this.code = 400;
    }
}

class NotEnoughBillsAvailable extends Error {
    constructor(message) {
        super(message || "There is not enough bills available in this ATM.");
        Error.captureStackTrace(this, InsuficientBalanceError);
        this.code = 503;
    }
}

export { AccountNotFoundError, InsuficientBalanceError, InvalidAmountError, NotEnoughBillsAvailable };