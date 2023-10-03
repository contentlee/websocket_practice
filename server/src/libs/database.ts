import { Db, MongoClient } from "mongodb";

class Database {
  static db: Db;

  static async connect(callback: () => void) {
    try {
      const client = await MongoClient.connect(process.env.MONGO_URI as string);
      Database.db = client.db("chat");
      callback();
    } catch (err) {
      console.log(err);
    }
  }
}

export default Database;
