import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const WithdrawPromotions = new Mongo.Collection("withdrawpromotion");

WithdrawPromotions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

WithdrawPromotions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const WithdrawPromotion = Class.create({
  name: "WithdrawPromotions",
  collection: WithdrawPromotions,
  fields: {
    staffId: String,
    staffName: String,
    staffType: String,
    staffClass: String,
    presentDesignation: String,
    returnToDesignation: String,
    presentSalaryStructure: String,
    returnToSalaryStructure: String,
    reasonForWithdrawal: String,
    requestStatus: String,
    returnPromotionDate: String,
    user: String,
    requestDate: String
  }
});

export { WithdrawPromotion, WithdrawPromotions };
