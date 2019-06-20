import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const Cadres = new Mongo.Collection("cadres");

Cadres.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Cadres.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const Cadre = Class.create({
  name: "Cadres",
  collection: Cadres,
  fields: {
    cadre: String,
    cadreRank: {
      type: [Object]
    }
  }
});

export { Cadre, Cadres };
