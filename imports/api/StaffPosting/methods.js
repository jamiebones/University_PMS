import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { StaffPosting } from "../../api/StaffPosting/StaffPostingClass";
import { _ } from "meteor/underscore";
import { FindMax } from "../../modules/utilities";

Meteor.methods({
  "staffposting.approveorcancelposting": function StaffPostingmethod(
    status,
    staffId,
    newUnit,
    _id
  ) {
    debugger;
    check(status, String);
    check(staffId, String);
    check(newUnit, String);
    check(_id, String);
    let statusMessage = "";
    status === "approve"
      ? (statusMessage = "approved")
      : (statusMessage = "cancelled");
    //get the staff object
    const staffIdRegEx = new RegExp("^" + staffId + "$", "i");
    const postedStaff = StaffMember.findOne({ staffId: staffIdRegEx });
    //find the current posting with status proposed
    const newPosting = postedStaff.postings.find(posting => {
      return posting.postingStatus === "proposed";
    });
    //make a new object from that posting
    const editedPosting = { ...newPosting };
    const serialToRemove = newPosting && newPosting.serial;
    editedPosting.postingStatus = statusMessage;
    //add edited posting to the array
    postedStaff.postings.push(editedPosting);
    //remove the old obj in the array
    const newpostingArray = postedStaff.postings.filter(posting => {
      return (
        posting.serial !== serialToRemove &&
        posting.postingStatus === "proposed"
      );
    });

    postedStaff.postings = [...newpostingArray];
    postedStaff.postingProposed = false;
    statusMessage === "approved" ? (postedStaff.currentPosting = newUnit) : "";

    //let's fix the posting object
    const proposedPosting = StaffPosting.findOne(_id);
    proposedPosting.status = statusMessage;
    try {
      proposedPosting.save();
      postedStaff.save();
    } catch (error) {
      throw new Meteor.Error(error.reason);
    }
  },
  "staffposting.proposeNewPosting": function StaffPostingmethod(posting) {
    check(posting, Object);
    const {
      staffId,
      staffName,
      unitFrom,
      newUnit,
      startingDate,
      previousPostings
    } = posting;
    const staffIdRegEx = new RegExp("^" + staffId + "$", "i");
    const postedStaff = StaffMember.findOne({ staffId: staffIdRegEx });
    if (!_.isEmpty(postedStaff)) {
      //lets do the posting here
      let newPosting = new StaffPosting();
      newPosting.staffId = staffId;
      newPosting.staffName = staffName;
      newPosting.unitFrom = unitFrom;
      newPosting.newUnit = newUnit;
      newPosting.status = "1";
      newPosting.startingDate = startingDate;
      newPosting.dateofPosting = new Date().toISOString();
      newPosting.previousPostings = previousPostings;
      try {
        newPosting.save();
        let postingSerial = FindMax(postedStaff.postings, "serial");
        const postingObj = {
          unitName: newUnit,
          serial: postingSerial++,
          postingDate: startingDate,
          postingStatus: "1"
        };
        postedStaff.postings.push(postingObj);
        postedStaff.postingProposed = true;
        postedStaff.save();
      } catch (error) {
        throw new Meteor.Error(`There was an error: ${error}`);
      }
    }
  }
});

rateLimit({
  methods: [],
  limit: 5,
  timeRange: 1000
});
