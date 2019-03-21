import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffPostings } from "../StaffPostingClass";
import moment from "moment";

Meteor.publish(
  "staffposting.getProposedPosting",
  function StaffMembersPublication() {
    return StaffPostings.find({ status: "1" });
  }
);

Meteor.publish(
  "staffposting.getDirectorApprovedPosting",
  function StaffMembersPublication() {
    return StaffPostings.find({ status: "2" });
  }
);

Meteor.publish(
  "staffposting.getApprovedPosting",
  function StaffMembersPublication() {
    return StaffPostings.find({ status: "4" });
  }
);

Meteor.publish(
  "staffposting.getApprovedPostingByDate",
  function StaffMembersPublication(postingDate) {
    check(postingDate, String);
    let date = moment(new Date()).toISOString();
    let query = {
      status: "4",
      startingDate: {
        $gt: date
      }
    };
    switch (postingDate) {
      case "1":
        query.status = "4";
        query["startingDate"] = {
          $gt: date
        };
        break;
      case "2":
        const start = moment(new Date()).subtract(7, "days");
        query.status = "4";
        query["startingDate"] = {
          $lt: date,
          $gt: start.toISOString()
        };
        break;
      case "3":
        query.status = "4";
        query["startingDate"] = {
          $lte: date
        };
    }

    return StaffPostings.find(query);
  }
);

Meteor.publish(
  "staffposting.getApprovedPostingStatistics",
  function StaffMembersPublication() {
    let date = moment(new Date()).toISOString();
    let query = {
      status: "4",
      startingDate: {
        $gt: date
      }
    };
    return StaffPostings.find(query);
  }
);
