import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffMembers } from "../StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import { UniversityUnits } from "../../../api/UniversityUnit/UniversityUnitClass";

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
  "staffmembers.getStaffInDepartment",
  function StaffMembersPublication(unit) {
    check(unit, Match.OneOf(String, null, undefined));
    let query = {
      currentPosting: new RegExp("^" + unit + "$", "i"),
      staffType: "2"
    };
    return [StaffMembers.find(query), UniversityUnits.find()];
  }
);

Meteor.publish(
  "staffposting.getoverstayedStaff",
  function StaffMembersPublication() {
    return StaffMembers.find({ staffType: "2" });
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
      query.staffType = "2";
      delete query.designation;
    }

    if (designation !== "") {
      query.designation = new RegExp("^" + designation + "$", "i");
      query.staffType = "2";
      delete query.staffId;
    }

    return [StaffMembers.find(query), Designations.find()];
  }
);

Meteor.publish(
  "staffmembers.getAllStaffbyDesignationAndStaffId",
  function StaffMembersPublication(designation, staffId) {
    check(designation, Match.OneOf(String, null, undefined));
    check(staffId, Match.OneOf(String, null, undefined));

    let query = {
      staffId: "",
      designation: ""
    };

    if (staffId !== "") {
      query.staffId = new RegExp("^" + staffId + "$", "i");
      delete query.designation;
    }

    if (designation !== "") {
      query.designation = designation;
      delete query.staffId;
    }
    return [
      StaffMembers.find(query),
      Designations.find({}, { sort: { rank: 1 } })
    ];
  }
);
