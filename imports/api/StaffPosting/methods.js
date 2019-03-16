import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { StaffPosting } from "../../api/StaffPosting/StaffPostingClass";
import { _ } from "meteor/underscore";
import { FindMax } from "../../modules/utilities";

Meteor.methods({
  "staffposting.approveorcancelpostingDirector": function StaffPostingmethod(
    status,
    staffId,
    _id
  ) {
    check(status, String);
    check(staffId, String);
    check(_id, String);
    const proposedPosting = StaffPosting.findOne(_id);
    const staffIdRegEx = new RegExp("^" + staffId + "$", "i");
    const postedStaff = StaffMember.findOne({ staffId: staffIdRegEx });
    proposedPosting.status = status;
    //getting the posting with a status of proposed
    const newPosting = postedStaff.postings.find(posting => {
      return posting.postingStatus === "1";
    });
    //saving the posting in a new object
    //so as we don't mutate the object
    const editedPosting = { ...newPosting };
    const serialToRemove = newPosting && newPosting.serial;
    editedPosting.postingStatus = status;
    //add edited posting to the array
    postedStaff.postings.push(editedPosting);
    //remove the old obj in the array
    const newpostingArray = postedStaff.postings.filter(posting => {
      return posting.serial !== serialToRemove && posting.postingStatus === "1";
    });
    postedStaff.postings = [...newpostingArray];
    try {
      if (status === "3") {
        //posting proposal was rejected by the director
        postedStaff.postingProposed = false;
      }
      proposedPosting.save();
      postedStaff.save();
    } catch (error) {
      throw new Meteor.Error(error.reason);
    }
  },
  "staffposting.approveorcancelpostingRegistrar": function StaffPostingmethod(
    status,
    staffId,
    _id
  ) {
    check(status, String);
    check(staffId, String);
    check(_id, String);
    const proposedPosting = StaffPosting.findOne(_id);
    const staffIdRegEx = new RegExp("^" + staffId + "$", "i");
    const postedStaff = StaffMember.findOne({ staffId: staffIdRegEx });
    proposedPosting.status = status;
    //getting the posting with a status of proposed
    const newPosting = postedStaff.postings.find(posting => {
      return posting.postingStatus === "1";
    });
    //saving the posting in a new object
    //so as we don't mutate the object
    const editedPosting = { ...newPosting };
    const serialToRemove = newPosting && newPosting.serial;
    editedPosting.postingStatus = status;
    //add edited posting to the array
    postedStaff.postings.push(editedPosting);
    //remove the old obj in the array
    const newpostingArray = postedStaff.postings.filter(posting => {
      return posting.serial !== serialToRemove && posting.postingStatus === "1";
    });
    postedStaff.postings = [...newpostingArray];
    try {
      if (status === "3") {
        //posting proposal was rejected by the director
        postedStaff.postingProposed = false;
      }
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
      previousPostings,
      designation
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
      newPosting.designation = designation;
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
