import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffPostings } from "../StaffPostingClass";

Meteor.publish(
  "staffposting.getProposedPosting",
  function StaffMembersPublication() {
    return StaffPostings.find({ status: "proposed" });
  }
);
