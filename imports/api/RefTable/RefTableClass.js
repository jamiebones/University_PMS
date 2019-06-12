import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const RefTables = new Mongo.Collection("reftables");

RefTables.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

RefTables.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

//type here means if the document is the one
//with a personal ref like uu/pf/9816/1 or a
//more generic one like uu/pf/name_of_unit/serial
//type = "1" means individual reference
//type = "2" means generic reference

const RefTable = Class.create({
  name: "RefTables",
  collection: RefTables,
  fields: {
    ref: String,
    serial: {
      type: String,
      optional: true
    },
    documentId: String,
    type: String
  }
});

export { RefTable, RefTables };
