import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffPostings } from "../../StaffPosting/StaffPostingClass";
import { _ } from "meteor/underscore";
import moment from "moment";

Meteor.methods({
  "staffposting.getPostingSummary": function StaffPostingmethod() {
    let date = moment(new Date()).toISOString();
    const pipeline = [
      { $match: { status: "4", startingDate: { $gt: date } } },
      { $project: { designation: 1, unitFrom: 1 } },
      {
        $group: {
          _id: { Department: "$unitFrom", Designation: "$designation" },
          totalDocs: { $sum: 1 }
        }
      }
    ];
    const result = StaffPostings.aggregate(pipeline);
  },
  "staffposting.getApprovedPosting": function StaffPostingmethod() {
    let date = moment(new Date()).toISOString();
    const pipeline = [
      { $match: { status: "4", startingDate: { $gte: date } } },
      { $group: { _id: "$staffId", data: { $last: "$$ROOT" } } },
      // { $unwind: "$data" }
      { $sort: { startingDate: -1, designation: 1 } }
      // { $limit: 1 }
    ];
    const result = StaffPostings.aggregate(pipeline);
    //console.log(result);
    return result;
  }
});
