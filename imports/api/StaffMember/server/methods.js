import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { StaffReliefPostings } from "../../../api/StaffReliefPosting/StaffReliefPostingClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import { _ } from "meteor/underscore";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import { CalculateDueForRetirement } from "../../../modules/utilitiesComputation";
import PrintStaffDueForPromotion from "../../../modules/server/printdueforpromotionlist";
import moment from "moment";

Meteor.methods({
  getRecords: function StaffMembersmethod() {
    const pipeline = [
      { $match: { staffClass: "Senior Staff", staffType: "1" } },
      {
        $group: {
          _id: "$designation",
          data: { $push: "$$ROOT" }
        }
      }
    ];
    const result = StaffMembers.aggregate(pipeline);
    return result;
  },
  getNominalRoll: function StaffMembersmethod() {
    console.time();
    const pipeline = [
      {
        $project: {
          biodata: 1,
          salaryStructure: 1,
          currentPosting: 1,
          designation: 1
        }
      },

      {
        $group: {
          _id: "$currentPosting",
          data: { $push: "$$ROOT" }
        }
      },
      { $sort: { _id: 1, salaryStructure: 1 } }
    ];
    const result = StaffMembers.aggregate(pipeline);

    let arrayTop = [];
    let finalArray = [];

    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      if (current._id == "OFFICE OF THE VICE-CHANCELLOR") {
        arrayTop[0] = result[i];
      } else if (
        current._id == "OFFICE OF THE DEPUTY VICE-CHANCELLOR (ACADEMIC)"
      ) {
        arrayTop[1] = result[i];
      } else if (
        current._id == "OFFICE OF THE DEPUTY VICE-CHANCELLOR (ADMINISTRATION)"
      ) {
        arrayTop[2] = result[i];
      } else if (current._id == "OFFICE OF THE VICE-CHANCELLOR") {
        arrayTop[3] = result[i];
      } else if (current._id == "OFFICE OF THE REGISTRAR") {
        arrayTop[4] = result[i];
      } else {
        finalArray.push(result[i]);
      }
    }

    const arr = [...arrayTop, ...finalArray];
    console.log(console.timeEnd());
    const bb = arr.filter(ele => ele != null);
    return bb.splice(0, 10);
  },
  getOverStayedStaff: function StaffMembersmethod() {
    let query = {};

    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      query.staffClass = "Senior Staff";
      query.staffType = "2";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      query.staffClass = "Junior Staff";
      query.staffType = "2";
    }

    query.staffType = "2";
    query.postings = { $exists: true, $ne: [] };

    const pipeline = [
      { $match: query },
      {
        $project: {
          _id: 0,
          staffId: 1,
          postings: 1,
          currentPosting: 1,
          staffClass: 1,
          biodata: 1,
          designation: 1,
          salaryStructure: 1
        }
      },

      { $unwind: { path: "$postings", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: "$staffId",
          postings: { $last: "$postings" },
          data: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 1,
          postings: 1,
          data: 1,
          periodSpent: {
            $divide: [
              { $subtract: [new Date(), { $toDate: "$postings.postingDate" }] },
              1000 * 60 * 60 * 24 * 365
            ]
          }
        }
      },
      { $match: { periodSpent: { $gte: 5 } } },
      { $sort: { periodSpent: -1 } }
    ];
    const result = StaffMembers.aggregate(pipeline);
    return result;
  },
  "staffmembers.getstaff": function StaffMemberMethod() {
    return StaffMembers.find().fetch();
  },

  "staffmembers.getstaffRetirement": function StaffMemberMethod() {
    const pipeline = [
      { $match: { officialRemark: "active" } },

      {
        $project: {
          _id: 1,
          biodata: 1,
          currentPosting: 1,
          salaryStructure: 1,
          designation: 1,
          staffId: 1,
          dob: 1,
          dateOfAppointmentInUniversit: 1,
          staffType: 1,
          age: {
            $subtract: [
              new Date().getFullYear(),
              { $year: { $toDate: "$dob" } }
            ]
          }
        }
      },
      { $match: { age: { $gte: 60 } } }
    ];

    const staff = StaffMembers.aggregate(pipeline);
    const result = CalculateDueForRetirement(staff);
    console.log(result.length);
    return result;
  },

  "staffmembers.getstaffStay": function StaffMemberMethod() {
    const pipeline = [
      {
        $project: {
          staffId: "$staffId",
          biodata: "$biodata",
          department: "$currentPosting",
          year: "$dateOfAppointmentInUniversity",
          timeSpent_total: {
            $divide: [
              {
                $subtract: [
                  new Date(),
                  {
                    $dateFromString: {
                      dateString: "$dateOfAppointmentInUniversity"
                    }
                  }
                ]
              },
              1000 * 60 * 60 * 24 * 365
            ]
          }
        }
      }
      //{ $match: { $timeSpent_total: { $gte: 30 } } }
    ];
    const result = StaffMembers.aggregate(pipeline);
    return result;
  },
  getStaffDueForPromotion: function StaffMembersmethod(designation) {
    //apply filter here based on role type and designation
    check(designation, Match.OneOf(String, null, undefined));

    let query = {};
    let rankQuery = {};

    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      query.staffClass = "Senior Staff";
      query.staffType = "2";
      rankQuery.type = "Senior Staff";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      query.staffClass = "Junior Staff";
      query.staffType = "2";
      rankQuery.type = "Junior Staff";
    }

    if (GetDetailsBasedOnRole("ASE", "Personnel")) {
      query.staffType = "1";
      delete query.staffClass;
    }

    if (designation) {
      query.designation = designation;
    }

    if (designation == "all") {
      delete query.designation;
    }

    query.dateOfLastPromotion = { $ne: "-" };

    const pipeline = [
      { $match: query },
      {
        $project: {
          yearsSincePromotion: {
            $subtract: [
              new Date().getFullYear(),
              { $year: { $toDate: "$dateOfLastPromotion" } }
            ]
          },

          biodata: 1,
          designation: 1,
          salaryStructure: 1,
          currentPosting: 1,
          dateOfLastPromotion: 1,
          staffId: 1,
          certificate: 1
        }
      },
      { $match: { yearsSincePromotion: { $gte: 3 } } }
    ];
    const staffArray = StaffMembers.aggregate(pipeline);
    const designations = Designations.find(rankQuery, {
      sort: { rank: 1 }
    }).fetch();

    const careerPeak = [
      "VICE CHANCELLOR",
      "PROFESSOR",
      "PROFESSOR (DEAN)",
      "REGISTRAR",
      "DIRECTOR",
      "DIRECTOR, HEALTH SERVICES",
      "DIRECTOR INTERNAL AUDITOR",
      "PROFESSOR (DVC)",
      "PROFESSOR (DIRECTOR)",
      "PROFESSOR (PROVOST)",
      "BURSAR"
    ];
    const promotionArray = staffArray.filter(staff => {
      return !careerPeak.includes(staff.designation.toUpperCase());
    });

    const sortPromotionArray = promotionArray.sort((a, b) => {
      return b.designation - a.designation;
    });

    return [sortPromotionArray, designations, sortPromotionArray.length];
  },
  "staffmembers.getNonTeachingStaffInDept": function StaffMembersFunction(
    dept
  ) {
    check(dept, Match.OneOf(String, null, undefined));
    let query = {};
    const department = dept.toUpperCase();

    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      query.staffClass = "Senior Staff";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      query.staffClass = "Junior Staff";
    }

    query.staffType = "2";
    query.currentPosting = department;
    let todayDate = moment(new Date()).toISOString();
    const staffArray = StaffMembers.find(query).fetch();
    let reliefArray = StaffReliefPostings.find({
      reliefEnd: { $lte: todayDate }
    }).fetch();
    let staffOnRelief = [];
    let finalArray = [];
    //loop through the staff members array
    //if we have a posting object add it.
    for (let i = 0; i < staffArray.length - 1; i++) {
      //individual array
      const staffObj = staffArray[i];
      //find if the staff is on relief duty
      const findRelief = reliefArray.find(e => {
        return (
          e.reliever_staffId.toUpperCase() == staffObj.staffId.toUpperCase()
        );
      });
      if (findRelief) {
        //idiot is on relief duty add the relief to staff duty
        staffObj.reliefDuty = findRelief;
        //remove the object from the array
        staffOnRelief.push(staffObj);
        staffArray.splice(staffArray[i], 1);
      } else {
        continue;
      }
    }
    finalArray = [...staffArray, ...staffOnRelief];
    return finalArray;
  },
  "staffmembers.getStaffDueForPromotion": function StaffMembersmethod(
    designation
  ) {
    //apply filter here based on role type and designation
    check(designation, Match.OneOf(String, null, undefined));
    //check(initialPull, Match.OneOf(Number, null, undefined));

    let query = {};
    let rankQuery = {};

    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      query.staffClass = "Senior Staff";
      query.staffType = "2";
      rankQuery.type = "Senior Staff";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      query.staffClass = "Junior Staff";
      query.staffType = "2";
      rankQuery.type = "Junior Staff";
    }

    if (GetDetailsBasedOnRole("ASE", "Personnel")) {
      query.staffType = "1";
      delete query.staffClass;
    }

    if (designation) {
      query.designation = designation;
    }

    if (designation == "all") {
      delete query.designation;
    }

    query.dateOfLastPromotion = { $ne: "-" };

    const pipeline = [
      { $match: query },
      {
        $project: {
          yearsSincePromotion: {
            $subtract: [
              new Date().getFullYear(),
              { $year: { $toDate: "$dateOfLastPromotion" } }
            ]
          },

          biodata: 1,
          designation: 1,
          salaryStructure: 1,
          currentPosting: 1,
          dateOfLastPromotion: 1,
          staffId: 1,
          certificate: 1
        }
      },
      { $match: { yearsSincePromotion: { $gte: 3 } } },
      //apply grouping here according to designation
      {
        $group: {
          _id: "$designation",
          data: { $push: "$$ROOT" }
        }
      }
    ];
    const staffArray = StaffMembers.aggregate(pipeline);
    const designations = Designations.find(rankQuery, {
      sort: { rank: 1 }
    }).fetch();

    const careerPeak = [
      "VICE CHANCELLOR",
      "PROFESSOR",
      "PROFESSOR (DEAN)",
      "PROFESSOR (CO-ORDINATOR)",
      "REGISTRAR",
      "DIRECTOR",
      "DIRECTOR, HEALTH SERVICES",
      "DIRECTOR INTERNAL AUDITOR",
      "PROFESSOR (DVC)",
      "PROFESSOR (DIRECTOR)",
      "PROFESSOR (PROVOST)",
      "BURSAR"
    ];
    const promotionArray = staffArray.filter(staff => {
      return !careerPeak.includes(staff._id.toUpperCase());
    });

    const sortPromotionArray = promotionArray.sort((a, b) => {
      return b._id - a._id;
    });

    //initial pull is the amount first requested
    //then you can get everything

    return [sortPromotionArray, designations, sortPromotionArray.length];
  },
  "staffmembers.printlistofstaffdueforpromotion": function StaffMembersPrint(
    staff
  ) {
    check(staff, Object);
    return PrintStaffDueForPromotion(staff)
      .then(pdf => {
        return pdf;
      })
      .catch(e => {
        console.log(e);
      });
  },
  "staffmembers.getStaffById": function StaffMembersFunction(staffId) {
    check(staffId, String);
    const user = StaffMembers.findOne({ staffId: staffId });
    return user;
  }
});
