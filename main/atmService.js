import * as repository from "./atmRepository";
import { NotEnoughBillsAvailable } from "./exception";

const bill_values = [2, 5, 10, 20, 50, 100];

function withdraw(amount, callback) {
    try {
        let rest = amount;
        const bills = new Map();
        const storedBills = new Map(repository.getBills());

        function selectBills(num, billValue) {
            if (num) {
                const available = storedBills.has(billValue) ? storedBills.get(billValue) : 0;
                const withdrawn = num < available ? num : available
                const pocket = bills.has(billValue) ? bills.get(billValue) : 0;
                bills.set(billValue, pocket + withdrawn);
                storedBills.set(billValue, available - withdrawn);
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

        bill_values.reverse().forEach((billValue) => {
            const num = Math.floor(rest / billValue);
            selectBills(num, billValue);
        });

        if (rest) {
            throw new NotEnoughBillsAvailable();
        }

        repository.saveBills(storedBills);

        callback({
            fifty_brl_bill: bills.get(50),
            twenty_brl_bill: bills.get(20)
        });
    } catch (err) {
        callback(null, err);
    }
}

export { withdraw };