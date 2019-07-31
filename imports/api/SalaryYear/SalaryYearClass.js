import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const SalaryYears = new Mongo.Collection("salaryyear");

SalaryYears.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

SalaryYears.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const SalaryYear = Class.create({
  name: "SalaryYears",
  collection: SalaryYears,
  fields: {
    year: String
  }
});

export { SalaryYear, SalaryYears };
