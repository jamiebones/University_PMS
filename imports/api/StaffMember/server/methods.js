import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";

Meteor.methods({
  getRecords: function Customersmethod() {
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
  }
});
