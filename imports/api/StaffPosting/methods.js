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
import Notify from "../../modules/server/classes/notification";
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
        postedStaff.postingProposed = false;
        //remove the posting object from the posting array
        //it was not successful
        postedStaff.postings = newpostingArray;
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
      //lets check if staff posting date has been set before
      if (postedStaff.postings.length == "0") {
        //we don't have a first time posting date set
        //lets throw an error to the client
        throw new Meteor.Error(
          "Please set the staff posting date before initiating posting procedures"
        );
      }
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

        postedStaff.postingProposed = true;

        //if the posting is been done by register just approved it
        //no need for confirmation
        if (GetDetailsBasedOnRole("Registrar", "Personnel")) {
          postingObj.postingStatus = "4";
          newPosting.status = "4";
          postedStaff.postingProposed = false;
          //fix staff new unit
          postedStaff.currentPosting = postingObj.unitName;
        }

        let posting = new Postings(postingObj);

        postedStaff.postings = [...postedStaff.postings, posting];
        newPosting.save();
        postedStaff.save();
        //who is carrying out the posting. find out if is a normal schedule
        //officer or is the Director of Personnel
        if (GetDetailsBasedOnRole("Director", "Personnel")) {
          //postingg carried out by Director so message is for the Registrat
          const newNotification = new Notify();
          newNotification.sendNotification({
            accountType: "Registrar",
            from: "Director, Directorate of Human Resources",
            message:
              "Please, check the staff posting list for approval. Thank you."
          });
        }
        if (GetDetailsBasedOnRole("SATS", "Personnel")) {
          //posting carried out by posting officer so message is for the Director
          const newNotification = new Notify();
          newNotification.sendNotification({
            accountType: "Director",
            from: "Posting Officer SATS, Directorate of Human Resources",
            message:
              "Please, check the staff posting list for approval. Thank you."
          });
        }
        if (GetDetailsBasedOnRole("JSE", "Personnel")) {
          //posting carried out by posting officer so message is for the Director
          const newNotification = new Notify();
          newNotification.sendNotification({
            accountType: "Director",
            from: "Posting Officer JSE, Directorate of Human Resources",
            message:
              "Please, check the staff posting list for approval. Thank you."
          });
        }
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
