import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const SalaryScales = new Mongo.Collection("salaryscales");

SalaryScales.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

SalaryScales.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const Scale = Class.create({
  name: "Scale",
  fields: {
    step: Number,
    amount: String
  }
});

const SalaryScale = Class.create({
  name: "SalaryScales",
  collection: SalaryScales,
  fields: {
    scale: [Scale],
    scaleNumber: Number
  }
});

export { SalaryScale, SalaryScales, Scale };
