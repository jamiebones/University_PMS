import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const UniversityUnits = new Mongo.Collection("universityunit");

UniversityUnits.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

UniversityUnits.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const UniversityUnit = Class.create({
  name: "UniversityUnits",
  collection: UniversityUnits,
  fields: {
    name: String
  }
});

export { UniversityUnit, UniversityUnits };
