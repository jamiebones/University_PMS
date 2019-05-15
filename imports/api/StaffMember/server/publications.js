import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffMembers } from "../StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import { StaffReliefPostings } from "../../../api/StaffReliefPosting/StaffReliefPostingClass";
import { UniversityUnits } from "../../../api/UniversityUnit/UniversityUnitClass";
import Documents from "../../../api/Documents/Documents";
import moment from "moment";

Meteor.publish(
  "staffmembers.getStaffbyStaffId",
  function StaffMembersPublication(staffId) {
    check(staffId, Match.OneOf(String, null, undefined));
    let query = {
      staffId: staffId.toUpperCase()
    };
    return StaffMembers.find(query);
  }
);

Meteor.publish(
  "staffmembers.getStaffDocuments",
  function StaffMembersPublication(staffId) {
    check(staffId, Match.OneOf(String, null, undefined));
    let query = {
      staffId: staffId.toUpperCase()
    };
    return [
      Documents.find({ "meta.staffId": staffId.toUpperCase() }).cursor,
      StaffMembers.find(query, { field: { biodata: 1 } })
    ];
  }
);

Meteor.publish(
  "staffmembers.getStaffDueForPromotion",
  function StaffMembersPublication(query, rankQuery, designation) {
    check(query, Object);
    check(rankQuery, Object);
    check(designation, Match.OneOf(String, null, undefined));

    if (designation) {
      query.designation = designation;
    }
    if (designation == "all") {
      delete query.designation;
    }

    return [
      StaffMembers.find(query, designation ? {} : { limit: 100 }),
      Designations.find(rankQuery)
    ];
  }
);

Meteor.publish(
  "staffmembers.getStaffInDepartment",
  function StaffMembersPublication(unit) {
    check(unit, Match.OneOf(String, null, undefined));
    let query = {
      currentPosting: unit,
      staffType: "2"
    };
    return [StaffMembers.find(query), UniversityUnits.find()];
  }
);

Meteor.publish(
  "staffmembers.getNominalRollForDepartment",
  function StaffMembersPublication(unit) {
    check(unit, Match.OneOf(String, null, undefined));
    let query = {
      currentPosting: unit
    };
    return [
      StaffMembers.find(query, {
        field: { biodata: 1, salaryStructure: 1, designation: 1, staffId: 1 },
        sort: { salaryStructure: -1 }
      }),
      UniversityUnits.find()
    ];
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
    let todayDate = moment(new Date()).toISOString();

    let query = {
      staffId: "",
      designation: "",
      postingProposed: { $exists: true, $eq: false }
    };

    if (staffId !== "") {
      query.staffId = staffId.toUpperCase();
      query.staffType = "2";
      delete query.designation;
    }

    if (designation !== "") {
      query.designation = designation;
      query.staffType = "2";
      delete query.staffId;
    }

    return [
      StaffMembers.find(query),
      Designations.find(),
      StaffReliefPostings.find({
        status: "approved",
        reliefEnd: { $gte: todayDate }
      })
    ];
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
      query.staffId = staffId.toUpperCase();
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
