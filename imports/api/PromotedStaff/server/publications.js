import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { PromotedStaffs } from "../PromotedStaffClass";
import { WithdrawPromotions } from "../../WithdrawPromotion/WithdrawPromotionClass";

import moment from "moment";

Meteor.publish(
  "promotedStaff.getStaffByIdStaffIdAndDesignation",
  function StaffMembersPublication(staffId) {
    check(staffId, Match.OneOf(String, null, undefined));
    let query = {
      staffId: staffId.toUpperCase()
    };
    return [
      PromotedStaffs.find(query, { sort: { savedDate: -1 }, limit: 1 }),
      WithdrawPromotions.find({
        staffId: staffId.toUpperCase,
        requestStatus: "pending",
        user: this.userId
      })
    ];
  }
);
