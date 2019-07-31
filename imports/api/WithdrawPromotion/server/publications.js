import { Meteor } from "meteor/meteor";
import { WithdrawPromotions } from "../WithdrawPromotionClass";
import { check, Match } from "meteor/check";

Meteor.publish({
  "withdrawpromotion.getPendingWithdrawals": function WithdrawPromotionRequest() {
    return [
      WithdrawPromotions.find({ requestStatus: "pending" }),
      Meteor.users.find(
        {},
        {
          fields: {
            emails: 1,
            profile: 1,
            services: 1,
            roles: 1,
            createdAt: 1,
            status: 1
          }
        }
      )
    ];
  }
});
