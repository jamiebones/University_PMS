import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import {
  StaffPosting,
  Postings
} from "../../api/StaffPosting/StaffPostingClass";
import { _ } from "meteor/underscore";
import { FindMax, GetDetailsBasedOnRole } from "../../modules/utilities";
import moment from "moment";

Meteor.methods({
  "staffposting.approveorcancelposting": function StaffPostingmethod(
    status,
    staffId,
    newUnit,
    _id
  ) {
    check(status, String);
    check(staffId, String);
    check(newUnit, String);
    check(_id, String);
    const proposedPosting = StaffPosting.findOne(_id);
    const postedStaff = StaffMember.findOne({ staffId: staffId.toUpperCase() });
    proposedPosting.status = status;
    //get the last posting
    const postingSerial = FindMax(postedStaff.postings, "serial");
    //get this posting with the serial
    const findPosting = postedStaff.postings.find(posting => {
      return posting.serial == postingSerial;
    });

    //saving the posting in a new object
    //so as we don't mutate the object

    const editedPosting = { ...findPosting };
    editedPosting.postingStatus = status;
    const newPostToSave = new Postings(editedPosting);
    //remove the old obj in the array
    const newpostingArray = postedStaff.postings.filter(posting => {
      return posting.serial !== postingSerial;
    });
    postedStaff.postings = [...newpostingArray, newPostToSave];
    try {
      if (status === "3" || status === "5") {
        //posting proposal was rejected by the director
        postedStaff.postingProposed = true;
      } else if (status === "4") {
        //this is where i have to get an
        //save this in a cron table
        //only executes when re

        postedStaff.postingProposed = false;
        postedStaff.currentPosting = newUnit;
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

    const postedStaff = StaffMember.findOne({ staffId: staffId.toUpperCase() });
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
      newPosting.staffClass = postedStaff.staffClass;
      try {
        let postingSerial = FindMax(postedStaff.postings, "serial");
        postingSerial += 1;
        const postingObj = {
          unitName: newUnit,
          unitFrom: unitFrom,
          serial: postingSerial,
          postingDate: startingDate,
          postingStatus: "1"
        };

        //if the posting is been done by register just approved it
        if (GetDetailsBasedOnRole("Registrar", "Personnel")) {
          postingObj.postingStatus = "4";
          newPosting.status = "4";
        }
        let posting = new Postings(postingObj);

        postedStaff.postings = [...postedStaff.postings, posting];
        postedStaff.postingProposed = true;
        newPosting.save();
        postedStaff.save();
      } catch (error) {
        throw new Meteor.Error(`There was an error: ${error}`);
      }
    }
  },
  "staffPosting.savePostingDate": function staffPosting(posting) {
    check(posting, Object);
    const {
      staffId,
      staffName,
      designation,
      dateOfPosting,
      currentPosting
    } = posting;
    const postedStaff = StaffMember.findOne({ staffId: staffId.toUpperCase() });
    if (!_.isEmpty(postedStaff)) {
      //lets do the posting here
      let newPosting = new StaffPosting();
      newPosting.staffId = staffId;
      newPosting.staffName = staffName;
      newPosting.unitFrom = "first";
      newPosting.newUnit = currentPosting;
      newPosting.status = "4";
      newPosting.startingDate = dateOfPosting;
      newPosting.dateofPosting = dateOfPosting;
      newPosting.designation = designation;
      newPosting.staffClass = postedStaff.staffClass;
      try {
        let postingSerial = FindMax(postedStaff.postings, "serial");
        postingSerial += 1;
        const postingObj = {
          unitName: currentPosting,
          unitFrom: "first",
          serial: postingSerial,
          postingDate: dateOfPosting,
          postingStatus: "4"
        };
        let posting = new Postings(postingObj);

        postedStaff.postings = [...postedStaff.postings, posting];
        postedStaff.postingProposed = true;
        newPosting.save();
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
