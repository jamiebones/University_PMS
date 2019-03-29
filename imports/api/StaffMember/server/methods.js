import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";

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
  }
});
