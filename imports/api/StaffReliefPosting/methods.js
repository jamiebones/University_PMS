import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffReliefPosting } from "../../api/StaffReliefPosting/StaffReliefPostingClass";

Meteor.methods({
  "staffreliefposting.savenewRefliefPosting": function StaffPostingReliefmethod(
    reliefObject
  ) {
    check(reliefObject, Object);
    const reliefPosting = new StaffReliefPosting(reliefObject);
    return reliefPosting.save();
  },
  "staffreliefposting.approveorcancelposting": function StaffPostingReliefmethod(
    status,
    reliefId
  ) {
    check(status, String);
    check(reliefId, String);
    const reliefPosting = StaffReliefPosting.findOne(reliefId);
    reliefPosting.status = status;
    return reliefPosting.save();
  }
});
