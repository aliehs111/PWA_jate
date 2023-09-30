import { openDB } from "idb";
//initialize the database//open or create a db named "jate" version 1
const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      //create object store ("fake" relational database table) named jate with auto-incrementing ids
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
//add "data" to the object store with crud operations CREATE/UPDATE (put data into the object store)
export const putDb = async (content) => {
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readwrite"); //this is the transaction as per the indexDB documentation and specifies that the data is changeable by the user (readwrite as opposed to readonly)
  const store = tx.objectStore("jate");
  await store.put({
    id: 1,
    value: content,
  });
  console.log("content saved successfully");
};

// TODO: Add logic for a method that gets all the content from the database
//this is to retrieve the data from the object store with crud operation READ (i.e. "get" data from the object store)
export const getDb = async () => {
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readonly"); //since this is a READ crud op, the data is readonly and not modifiable by the user
  const store = tx.objectStore("jate");
  const content = await store.getAll();
  console.log("content retrieved successfully");
  return content.value;
};

initdb();
