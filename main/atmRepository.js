import * as mongodb from "./mongodb";

const stored = [
    { value: 2, quantity: 10 },
    { value: 5, quantity: 1 },
    { value: 10, quantity: 5 },
    { value: 20, quantity: 5 },
    { value: 50, quantity: 5 }
];

mongodb.client((err, db) => {
    const collection = db.collection("bills");
    collection.drop();
    collection.insertMany(stored);
    // collection.close();
});

function getBills(callback) {
    mongodb.client((err, db) => {
        const collection = db.collection("bills");
        collection.find().toArray((err, items) => {
            callback(items);
        });
    });
}

function saveBills(bills) {
    mongodb.client((err, db) => {
        const collection = db.collection("bills");
        collection.updateMany(stored);
        // collection.close();
    });
}

function getBill(value) {
    return stored.filter((v) => v.value == value)[0];
}

export { getBills, saveBills };