import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffMembers } from "../StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";

Meteor.publish(
  "staffmembers.getStaffbyStaffId",
  function StaffMembersPublication(staffId) {
    check(staffId, Match.OneOf(String, null, undefined));
    let query = {
      staffId: new RegExp("^" + staffId + "$", "i")
    };
    return StaffMembers.find(query);
  }
);

Meteor.publish(
  "staffmembers.getStaffbyDesignationAndStaffId",
  function StaffMembersPublication(designation, staffId) {
    check(designation, Match.OneOf(String, null, undefined));
    check(staffId, Match.OneOf(String, null, undefined));

    let query = {
      staffId: "",
      designation: "",
      postingProposed: { $exists: true, $eq: false }
    };

    if (staffId !== "") {
      query.staffId = new RegExp("^" + staffId + "$", "i");
      query.staffType = "Non Academic Staff";
      delete query.designation;
    }

    if (designation !== "") {
      query.designation = new RegExp("^" + designation + "$", "i");
      query.staffType = "Non Academic Staff";
      delete query.staffId;
    }

    return [StaffMembers.find(query), Designations.find()];
  }
);
