import * as repository from "./atmRepository";
import { NotEnoughBillsAvailable } from "./exception";

function getStoredBills() {
    return JSON.parse(JSON.stringify(repository.getBills()));
}

function withdraw(amount, callback) {
    let rest = amount;
    let bills = [];
    repository.getBills((storedBills) => {

        try {
            storedBills.forEach((bill) => bills.push({ value: bill.value, quantity: 0 }));

            function selectBills(num, billValue) {
                if (num) {
                    let bill =  storedBills.filter((v) => v.value == billValue)[0];
                    const available = bill ? bill.quantity : 0;
                    const withdrawn = num < available ? num : available;

                    bills
                        .filter((bill) => bill.value == billValue)
                        .map((bill) => bill.quantity = bill.quantity + withdrawn);

                    storedBills
                        .filter((bill) => bill.value == billValue)
                        .map((bill) => bill.quantity = available - withdrawn);

                    rest -= billValue * withdrawn;
                }
            }

            // Look for even numbers first
            if (rest % 2 == 0) {
                const unit = rest - Math.floor(rest / 10) * 10;
                const billValue = 2;
                const num = unit / billValue;
                selectBills(num, billValue);
            }

            storedBills.reverse().forEach((bill) => {
                const num = Math.floor(rest / bill.value);
                selectBills(num, bill.value);
            });

            if (rest) {
                throw new NotEnoughBillsAvailable();
            }

            repository.saveBills(storedBills, () => {
                callback(bills);
            });

            // callback(bills);
        } catch (err) {
            callback(null, err);
        }
    });
}

function deposit(bills, callback) {
    repository.getBills((storedBills) => {
        bills.forEach((bill) => {
            storedBills
                .filter((b) => b.value == bill.value)
                .map((b) => b.quantity += bill.quantity);
        });

        repository.saveBills(storedBills, () => {
            callback();
        });
    });
}

export { withdraw, deposit, getStoredBills };