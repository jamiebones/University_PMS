import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const StaffDocuments = new Mongo.Collection("staffdocuments");

StaffDocuments.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

StaffDocuments.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const StaffDocument = Class.create({
  name: "StaffDocuments",
  collection: StaffDocuments,
  fields: {
    staffId: String,
    document: String,
    dateAdded: String,
    documentSerial: Number
  }
});

export { StaffDocument, StaffDocuments };
