import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const NigeriaStates = new Mongo.Collection("nigeriastate");

NigeriaStates.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

NigeriaStates.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const NigeriaState = Class.create({
  name: "NigerianStates",
  collection: NigeriaStates,
  fields: {
    state: String,
    lga: {
      type: [String],
      optional: true,
      default() {
        return [];
      }
    }
  }
});

export { NigeriaState, NigeriaStates };
