const { MongoClient } = require("mongodb");
const log = require("./src/utils/winston");
const properties = require("./resources/properties.json");

const connectionURL = `mongodb://${properties.mongodo.user}:${properties.mongodo.password}@${properties.mongodo.host}:${properties.mongodo.port}`;
const dbName = "task-manager";

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      return log.error(err);
    }

    log.info(`MongoDB Connected: ${connectionURL}`);

    const db = client.db(dbName);

    const theUser = {
      name: "Carlos",
      lastName: "Torres",
      age: 38,
    };
    db.collection("users").insertOne(theUser, (error, result) => {
      if(error) {
        return log.error(`Unable to insert user: ${error}`);
      }
      log.info(JSON.stringify(result.ops));
    });
    log.info(`User inserted: ${JSON.stringify(theUser)}`);
  }
);
