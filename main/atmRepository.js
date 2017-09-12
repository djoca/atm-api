import * as mongodb from "./mongodb";

const stored = [
    { value: 2, quantity: 10 },
    { value: 5, quantity: 1 },
    { value: 10, quantity: 5 },
    { value: 20, quantity: 5 },
    { value: 50, quantity: 2 },
    { value: 100, quantity: 1 }
];

mongodb.client((err, db) => {
    const collection = db.collection("bills");
    collection.drop();
    collection.insertMany(stored);
});

function getBills(callback) {
    mongodb.client((err, db) => {
        const collection = db.collection("bills");
        collection.find().toArray((err, items) => {
            callback(items);
        });
    });
}

function saveBills(bills, callback) {
    saveBill(bills[0], bills.slice(1), () => {
        callback();
    });
}

function saveBill(bill, bills, callback) {
    mongodb.client((err, db) => {
        const collection = db.collection("bills");
        collection.update({value: bill.value}, bill, {upsert: true}, (err) => {
            if (bills.length > 0) {
                saveBill(bills[0], bills.slice(1), () => {
                    callback();
                });
            } else {
                callback(err);
            }
        });
    });
}

function getBill(value) {
    return stored.filter((v) => v.value == value)[0];
}

export { getBills, saveBills };