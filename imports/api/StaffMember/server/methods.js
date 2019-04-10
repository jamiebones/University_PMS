import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import moment from "moment";
import { _ } from "meteor/underscore";

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
    const pipeline = [
      { $match: { staffType: "2" } },
      {
        $project: {
          _id: 0,
          staffId: 1,
          postings: 1,
          currentPosting: 1,
          staffClass: 1
        }
      },
      //  { $unwind: {"$postings"} },
      { $group: { _id: "$staffId" } }
    ];
    const result = StaffMembers.aggregate(pipeline);
    return result;
  },
  "staffmembers.getstaff": function StaffMemberMethod() {
    return StaffMembers.find().fetch();
  },

  "staffmembers.getstaffStay": function StaffMemberMethod() {
    const pipeline = [
      {
        $project: {
          staffId: "$staffId",
          biodata: "$biodata",
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
  }
});
