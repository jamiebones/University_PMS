import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const UniversityCadres = new Mongo.Collection("universitycadre");

UniversityCadres.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

UniversityCadres.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const Ranks = Class.create({
  name: "Ranks",
  fields: {
    rankName: String,
    serial: Number
  }
});

const UniversityCadre = Class.create({
  name: "UniversityCadres",
  collection: UniversityCadres,
  fields: {
    cadre: String,
    ranks: {
      type: [Ranks],
      optional: true,
      default() {
        return [];
      }
    },
    serial: Number
  }
});

export { UniversityCadre, UniversityCadres, Ranks };
