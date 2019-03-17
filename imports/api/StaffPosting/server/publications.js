import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { StaffPostings } from "../StaffPostingClass";

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
