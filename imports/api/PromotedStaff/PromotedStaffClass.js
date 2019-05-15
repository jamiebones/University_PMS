import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const PromotedStaffs = new Mongo.Collection("promotedstaff");

PromotedStaffs.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

PromotedStaffs.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const PromotedStaff = Class.create({
  name: "PromotedStaffs",
  collection: PromotedStaffs,
  fields: {
    staffId: String,
    staffName: String,
    staffType: String,
    staffClass: String,
    oldDesignation: String,
    newDesignation: String,
    oldSalaryStructure: String,
    newSalaryStructure: String,
    oldPromotionDate: String,
    promotionYear: String,
    savedDate: String
  }
});

export { PromotedStaff, PromotedStaffs };
