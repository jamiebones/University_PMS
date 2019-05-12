import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffReliefPosting } from "../StaffReliefPostingClass";
import moment from "moment";

Meteor.publish(
  "staffreliefposting.getPendingPosting",
  function StaffReliefPublication() {
    let todayDate = moment(new Date()).toISOString();
    return StaffReliefPosting.find({
      status: "pending",
      reliefStart: { gte: todayDate }
    });
  }
);
