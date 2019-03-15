import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { StaffPosting } from "../../api/StaffPosting/StaffPostingClass";
import { _ } from "meteor/underscore";
import { FindMax } from "../../modules/utilities";

Meteor.methods({
  "staffposting.proposeNewPosting": function StaffPostingmethod(posting) {
    check(posting, Object);
    const { staffId, staffName, unitFrom, newUnit, startingDate } = posting;
    const staffIdRegEx = new RegExp("^" + staffId + "$", "i");
    const postedStaff = StaffMember.findOne({ staffId: staffIdRegEx });
    if (!_.isEmpty(postedStaff)) {
      //lets do the posting here
      let newPosting = new StaffPosting();
      newPosting.staffId = staffId;
      newPosting.staffName = staffName;
      newPosting.unitFrom = unitFrom;
      newPosting.newUnit = newUnit;
      newPosting.status = "proposed";
      newPosting.startingDate = startingDate;
      try {
        newPosting.save();
        let postingSerial = FindMax(postedStaff.postings, "serial");
        const postingObj = {
          unitName: newUnit,
          serial: postingSerial++,
          postingDate: startingDate,
          postingStatus: "proposed"
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
