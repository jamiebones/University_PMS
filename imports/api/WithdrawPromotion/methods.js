import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {
  WithdrawPromotion,
  WithdrawPromotions
} from "./WithdrawPromotionClass";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { PromotedStaff } from "../../api/PromotedStaff/PromotedStaffClass";
import Notify from "../../modules/server/classes/notification";
import Documents from "../../api/Documents/Documents";
import { _ } from "meteor/underscore";

Meteor.methods({
  "withdrawpromotion.makewithrawalrequest": function WithdrawPromotionmethod(
    withdrawObject
  ) {
    check(withdrawObject, Object);
    const withdrawRequest = new WithdrawPromotion(withdrawObject);
    withdrawRequest.save();
    //add the notification here for the Registrar to see

    const newNotification = new Notify();
    newNotification.sendNotification({
      accountType: "Registrar",
      from: "Schedule Officers",
      message:
        "Promotion letter withdrawal: Please check and approve the list of promotions that was withdrawn. Thank you"
    });
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
      returnPromotionDate,
      promotedId
    } = withdrawObject;
    if (status == "declined") {
      //we are deleting it
      return WithdrawPromotions.remove(id);
    }
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

    //delete the promotion letter here
    const staffMistakenPromoted = PromotedStaff.findOne(promotedId);
    const reference = staffMistakenPromoted.promotionletterRef;
    //find the document so that we can remove it.
    Documents.findOne({
      "meta.staffId": staffId,
      "meta.reference": reference
    }).remove();

    //remove the promotion staff from the promoted staff table
    return PromotedStaff.remove(promotedId);
  }
});
