import { Meteor } from "meteor/meteor";
import { WithdrawPromotions } from "../WithdrawPromotionClass";
import { check, Match } from "meteor/check";

Meteor.publish({
  "withdrawpromotion.getPendingWithdrawals": function WithdrawPromotionRequest() {
    return WithdrawPromotions.find({ requestStatus: "pending" });
  }
});
