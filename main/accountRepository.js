import * as mongodb from "./mongodb";
import { Account } from "./account";

mongodb.client((err, db) => {
    const collection = db.collection("accounts");
    collection.drop(() => {
        save(new Account(1001), () => {});
        save(new Account(1002, 100), () => {});
        save(new Account(1003, 1000), () => {});
    });
});

function get(id, callback) {
    mongodb.client((err, db) => {
        const collection = db.collection("accounts");
        collection.findOne({ _id: id }, {}, (err, row) => {
            if (row) {
                callback(new Account(row._id, row._balance));
            } else {
                callback(null);
            }
        });
    });
}

function save(account, callback) {
    mongodb.client((err, db) => {
        const collection = db.collection("accounts");
        collection.update({ _id: account.id }, account, { upsert: true }, () => {
            callback();
        });
    });
}

export { get, save };
