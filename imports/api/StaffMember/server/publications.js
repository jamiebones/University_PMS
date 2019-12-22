/*eslint-disable*/
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffMembers } from "../StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import { StaffReliefPostings } from "../../../api/StaffReliefPosting/StaffReliefPostingClass";
import { UniversityUnits } from "../../../api/UniversityUnit/UniversityUnitClass";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import { GetStaffQueryType } from "../../../modules/utilitiesComputation";
import { _ } from "meteor/underscore";
import Documents from "../../../api/Documents/Documents";
import moment from "moment";

Meteor.publish(
  "staffmembers.getStaffbyStaffId",
  function StaffMembersPublication(staffId) {
    check(staffId, Match.OneOf(String, null, undefined));
    let query = GetStaffQueryType();
    query.push({
      staffId: staffId.toUpperCase()
    });
    //we are using and query here because sats and ase logins can pull
    //data of staff on conmess
    return StaffMembers.find({ $and: query });
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
  "staffmembers.getStaffByIdStaffIdAndDesignation",
  function StaffMembersPublication(staffId) {
    check(staffId, Match.OneOf(String, null, undefined));
    let query = {
      staffId: staffId.toUpperCase()
    };
    return [StaffMembers.find(query), Designations.find()];
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
  "staffmembers.getAllUniversityDepartmentsAndDesignations",
  function StaffMembersPublication() {
    return [UniversityUnits.find(), Designations.find()];
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

    console.log(staffId);

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
    let query = GetStaffQueryType();
    //query is an array of query;
    if (staffId !== "") {
      query.push({ staffId: staffId.toUpperCase() });
    }

    if (designation !== "") {
      query.push({ designation: designation });
    }
    return [
      StaffMembers.find({ $and: query }),
      Designations.find({}, { sort: { rank: 1 } })
    ];
  }
);
