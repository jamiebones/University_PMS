import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {
  WithdrawPromotion,
  WithdrawPromotions
} from "./WithdrawPromotionClass";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";

Meteor.methods({
  "withdrawpromotion.makewithrawalrequest": function WithdrawPromotionmethod(
    withdrawObject
  ) {
    check(withdrawObject, Object);
    const withdrawRequest = new WithdrawPromotion(withdrawObject);
    return withdrawRequest.save();
  },
  "withdrawpromotion.deletewithrawalrequest": function WithdrawPromotionmethod(
    id
  ) {
    check(id, String);
    return WithdrawPromotions.remove(id);
  },
  "withdrawpromotion.registrarapprovecancel": function WithdrawPromotionmethod(
    withdrawObject
  ) {
    check(withdrawObject, Object);
    const {
      status,
      id,
      staffId,
      returnToDesignation,
      returnToSalaryStructure,
      returnPromotionDate
    } = withdrawObject;
    //update the request as appropriate
    const request = WithdrawPromotion.findOne(id);
    request.requestStatus = status;
    request.save();
    //find the staff and update as appropriate
    const staff = StaffMember.findOne({ staffId: staffId });
    staff.designation = returnToDesignation;
    staff.salaryStructure = returnToSalaryStructure;
    staff.dateOfLastPromotion = returnPromotionDate;
    staff.save();
  }
});
