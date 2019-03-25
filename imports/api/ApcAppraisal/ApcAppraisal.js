import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";
import { FindMax } from "../../modules/utilities";
import moment from "moment";

const ApcAppraisals = new Mongo.Collection("apcappraisals");

ApcAppraisals.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

ApcAppraisals.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const StaffAppraisal = Class.create({
  name: "StaffAppraisal",
  fields: {
    serial: Number,
    promotionYear: String,
    appraisalComment: String,
    commentByOfficerReportedOn: {
      type: String,
      optional: true
    },
    commentByReviewCommittee: {
      type: String,
      optional: true
    },
    apcComment: {
      type: String,
      optional: true
    }
  }
});

const ApcAppraisal = Class.create({
  name: "ApcAppraisals",
  collection: ApcAppraisals,
  fields: {
    staffId: String,
    currentRank: String,
    reviewCommittee: Number,
    salary: String,
    weight: Number,
    //weight is for sorting purpose
    dateAppointedOrPromoted: String,
    department: String,
    qualification: String,
    appraisal: {
      type: [StaffAppraisal],
      optional: true,
      default() {
        return [];
      }
    }
  },
  helpers: {}
});

export { ApcAppraisal, ApcAppraisals };
