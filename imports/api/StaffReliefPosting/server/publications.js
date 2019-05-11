import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffReliefPosting } from "../StaffReliefPostingClass";
import moment from "moment";

Meteor.publish(
  "staffreliefposting.getPendingPosting",
  function StaffReliefPublication() {
    return StaffReliefPosting.find({ status: "pending" });
  }
);
