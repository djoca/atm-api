import { MongoClient } from "mongodb";

function client(callback) {
    MongoClient.connect("mongodb://localhost:27017/atm", callback);
}

export { client };