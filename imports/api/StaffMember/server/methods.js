import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
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
