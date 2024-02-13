import { connect, connection } from "mongoose";
import { env } from "./env";

export class MongoConnection {
  static initialize() {
    try {
      connection
        .on("error", (error: any) => {
          console.log(`Failed to connect to MongoDB. Error: ${error}`);
        })
        .on("open", () => {
          console.log(`Connected to MongoDB. Welcome!`);
        })
        .on("close", () => {
          console.log("Disconnected from MongoDB.");
        });

      connect(env.MONGODB_URI);
    } catch (error) {
      console.log(`Failed to connect to MongoDB. Error: ${error}`);
    }
  }

  static finish() {
    connection.close();
  }
}
