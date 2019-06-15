import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { PromotedStaffs } from "../PromotedStaffClass";
import PrintPromotedStaffList from "../../../modules/server/printpromotedstafflist";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import moment from "moment";

Meteor.methods({
  "promotedStaff.getPromotionListByYear": function PromotedStaffmethod() {
    const pipeline = [
      {
        $group: {
          _id: {
            $year: {
              $dateFromString: {
                dateString: "$savedDate"
              }
            }
          }
        }
      },

      {
        $sort: { _id: -1 }
      }
    ];
    const result = PromotedStaffs.aggregate(pipeline);
    return result;
  },
  "promotedStaff.getPromotionByYear": function PromotedStaffMethod(
    selectedYear
  ) {
    check(selectedYear, String);
    let query = {};

    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      query.staffClass = "Senior Staff";
      query.staffType = "2";
    }

    if (GetDetailsBasedOnRole("ASE", "Personnel")) {
      query.staffClass = "Senior Staff";
      query.staffType = "1";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      query.staffClass = "Junior Staff";
      query.staffType = "2";
    }

    const pipeline = [
      {
        $match: query
      },
      {
        $project: {
          year: {
            $year: {
              $dateFromString: {
                dateString: "$savedDate"
              }
            }
          },
          staffId: "$staffId",
          staffName: "$staffName",
          oldDesignation: "$oldDesignation",
          newDesignation: "$newDesignation",
          oldSalaryStructure: "$oldSalaryStructure",
          newSalaryStructure: "$newSalaryStructure",
          oldPromotionDate: "$oldPromotionDate",
          promotionYear: "$promotionYear",
          savedDate: "$savedDate",
          promotionSalary: "$promotionSalary"
        }
      },
      {
        $match: { year: parseInt(selectedYear) }
      },
      {
        $sort: { newDesignation: 1, newSalaryStructure: 1 }
      }
    ];
    const result = PromotedStaffs.aggregate(pipeline);
    return result;
  },
  "promotedstaff.printpromotionlist": function PromotedStaffMethod(
    promotedObject
  ) {
    check(promotedObject, Object);
    return PrintPromotedStaffList(promotedObject)
      .then(pdf => {
        return pdf;
      })
      .catch(e => {
        console.log(e);
      });
  }
});
