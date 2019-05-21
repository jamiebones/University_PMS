import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {
  WithdrawPromotion,
  WithdrawPromotions
} from "./WithdrawPromotionClass";
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
  }
});
