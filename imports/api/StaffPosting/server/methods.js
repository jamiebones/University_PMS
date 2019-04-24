import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffPostings } from "../../StaffPosting/StaffPostingClass";
import { _ } from "meteor/underscore";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import moment from "moment";

Meteor.methods({
  "staffposting.getPostingSummary": function StaffPostingmethod() {
    let date = moment(new Date()).toISOString();
    let searchMatch = { status: "4", startingDate: { $gt: date } };
    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      searchMatch.staffClass = "Senior Staff";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      searchMatch.staffClass = "Junior Staff";
    }

    const pipeline = [
      {
        $match: searchMatch
      },
      { $project: { designation: 1, unitFrom: 1 } },
      {
        $group: {
          _id: {
            department: "$unitFrom",
            designation: "$designation"
          },
          totalDocs: { $sum: 1 }
        }
      }
    ];
    const result = StaffPostings.aggregate(pipeline);
    result.map(ele => {
      ele.type = "leaving";
    });
    //perform same here for those coming in

    const pipeline2 = [
      {
        $match: searchMatch
      },
      { $project: { designation: 1, newUnit: 1 } },
      {
        $group: {
          _id: {
            department: "$newUnit",
            designation: "$designation"
          },
          totalDocs: { $sum: 1 }
        }
      }
    ];

    const result2 = StaffPostings.aggregate(pipeline2);

    //add the type to it

    result2.map(ele => {
      ele.type = "coming";
    });

    const finalResult = [...result, ...result2];

    let holdingArray = [];

    //loop
    for (let i = 0; i < finalResult.length; i++) {
      const currentItem = finalResult[i];
      const findKey = _.findWhere(holdingArray, {
        dept: currentItem._id.department
      });
      if (findKey == undefined) {
        //new object created here
        const type = currentItem.type;
        const obj = {
          dept: currentItem._id.department,
          leaving: [],
          coming: []
        };
        if (type == "leaving") {
          obj.leaving.push({
            designation: currentItem._id.designation,
            number: currentItem.totalDocs
          });
        } else {
          obj.coming.push({
            designation: currentItem._id.designation,
            number: currentItem.totalDocs
          });
        }
        holdingArray.push(obj);
        //current item
      } else {
        //we already have in in the array
        //so we remove it first and add again after updating
        const remainArray = holdingArray.filter(ele => {
          return ele.dept != currentItem._id.department;
        });
        const type = currentItem.type;
        if (type == "leaving") {
          findKey.leaving.push({
            designation: currentItem._id.designation,
            number: currentItem.totalDocs
          });
        } else {
          findKey.coming.push({
            designation: currentItem._id.designation,
            number: currentItem.totalDocs
          });
        }

        holdingArray = [...remainArray, findKey];
      }
    }
    return holdingArray;
  },
  "staffposting.getApprovedPosting": function StaffPostingmethod() {
    let date = moment(new Date()).toISOString();
    let query = {
      status: "4",
      startingDate: {
        $gte: date
      }
    };
    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      query.staffClass = "Senior Staff";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      query.staffClass = "Junior Staff";
    }
    const pipeline = [
      { $match: query },
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
