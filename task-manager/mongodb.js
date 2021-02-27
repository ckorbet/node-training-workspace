const { MongoClient, ObjectID } = require("mongodb");
const log = require("./src/utils/winston");
const properties = require("./resources/properties.json");

const connectionURL = `mongodb://${properties.mongo.user}:${properties.mongo.password}@${properties.mongo.host}:${properties.mongo.port}`;
const dbName = `${properties.mongo.tmDbName}`;

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      return log.error(err);
    }

    log.info(`MongoDB Connected: ${connectionURL}`);

    const db = client.db(dbName);

    // const _id = new ObjectID();
    // log.info(`About to insert user with id ${_id}`);
    // const theUser = {
    //   _id,
    //   name: 'Carlos',
    //   lastName: 'Torres',
    //   age: 38,
    // };
    // db.collection('users').insertOne(theUser, (error, result) => {
    //   if(error) {
    //     return log.error(`Unable to insert user: ${error}`);
    //   }
    //   log.info(`User inserted: ${JSON.stringify(result.ops)}`);
    // });

    // const theUsers = [{
    //   name: 'Fulanito',
    //   lastName: 'Torres',
    //   age: 38,
    // },
    // {
    //   name: 'Menganito',
    //   lastName: 'Torres',
    //   age: 38,
    // }];
    // db.collection('users').insertMany(theUsers, (error, result) => {
    //   if(error) {
    //     return log.error(`Unable to insert users: ${error}`);
    //   }
    //   log.info(`Users inserted: JSON.stringify(result.ops)`);
    // });

    // const myTasks = require('./resources/tasks.json');
    // db.collection('tasks').insertMany(myTasks, (error, result) => {
    //   if(error) {
    //     return log.error(`Unable to insert tasks: ${JSON.stringify(error)}`);
    //   }
    //   log.info(`Tasks inserted: ${JSON.stringify(result.ops, null, 4)}`);
    // });

    // const idToFetch = '603241ff9a35cb3f782f65ac';
    // db.collection('tasks').findOne({ _id: new ObjectID(idToFetch)}, (error, task) => {
    //   if(error) {
    //     return log.error(`Unable to fetch task by id ${idToFetch}`);
    //   }
    //   log.info(`Task obtained: ${JSON.stringify(task)}`);
    // });

    // db.collection('users').find({age: 38}).toArray((error, users) => {
    //   if(error) {
    //     return log.error('Unable to get 38 yo users');
    //   }
    //   log.info(`${users.length} obtained with 38 yo`)
    // });

    db.collection("users")
      .updateOne(
        {
          // _id: new ObjectID('603246452ce4f4a2dd03120c')
          age: 49,
        },
        {
          // $set: {
          //   age: 49,
          // },
          $inc: {
            age: 6,
          },
        }
      )
      .then((result) => {
        if (result.matchedCount == 1 && result.modifiedCount === 1) {
          log.info("User update correctly done");
        } else {
          log.warn("Somenting went weird. Review the user update");
        }
      })
      .catch((error) => {
        log.error(error);
      });

    db.collection("tasks")
      .updateMany({ completed: false }, { $set: { completed: true } })
      .then((result) => {
        if (result.matchedCount > 0 && result.modifiedCount > 0) {
          log.info(
            `Tasks update correctly done. Updated ${result.modifiedCount} tasks`
          );
        } else {
          log.warn("Something went weird. Review the tasks update");
        }
      })
      .catch((error) => {
        log.error(error);
      });

    db.collection('users').deleteMany({age: 38})
    .then(result => {
      if(result.deletedCount > 0) {
        log.info(`Deletion correctly done. Removed ${result.deletedCount} users`);
      } else {
        log.warn('Somenting went werid. Review the deletion');
      }
    })
    .catch(error => {
      log.error(error);
    });


  }
);
