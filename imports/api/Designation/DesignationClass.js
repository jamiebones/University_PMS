import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const Designations = new Mongo.Collection("designation");

Designations.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Designations.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const Designation = Class.create({
  name: "Designations",
  collection: Designations,
  fields: {
    rank: String,
    type: {
      type: String,
      optional: true
    }
  }
});

export { Designation, Designations };
