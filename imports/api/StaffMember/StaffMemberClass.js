import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";
import { Postings } from "../StaffPosting/StaffPostingClass";
import { FindMax } from "../../modules/utilities";
import moment from "moment";

const StaffMembers = new Mongo.Collection("staffmembers");

StaffMembers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

StaffMembers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

//biodata class
const Biodata = Class.create({
  name: "Biodata",
  fields: {
    title: {
      type: String,
      optional: true
    },
    firstName: String,
    middleName: {
      type: String,
      optional: true
    },
    surname: String,
    profilePicture: {
      type: String,
      optional: true
    }
  }
});

const NewName = Class.create({
  name: "NewName",
  fields: {
    title: String,
    firstName: String,
    middleName: {
      type: String,
      optional: true
    },
    surname: String,
    documents: {
      type: [String],
      optional: true
    }
  }
});

const Education = Class.create({
  name: "Education",
  fields: {
    cert: {
      type: String,
      optional: true
    },
    date: {
      type: String,
      optional: true
    }
  }
});

const Languages = Class.create({
  name: "Languages",
  fields: {
    language: String,
    spoken: Boolean,
    written: Boolean
  }
});

const Documents = Class.create({
  name: "Documents",
  fields: {
    documentId: String,
    serial: Number
  }
});

const Promotions = Class.create({
  name: "Promotions",
  fields: {
    serial: Number,
    promotionYear: String,
    oldRank: String,
    newRank: String,
    oldContiss: String,
    newContiss: String
  }
});

const StaffMember = Class.create({
  name: "StaffMembers",
  collection: StaffMembers,
  fields: {
    biodata: Biodata,
    changeOfName: {
      type: NewName,
      optional: true
    },
    dob: String,
    sex: String,
    certificate: {
      type: [Education],
      optional: true
    },
    dateOfFirstAppointment: {
      type: String,
      optional: true
    },
    dateOfAppointmentInUniversity: {
      type: String,
      optional: true
    },
    employmentStatus: {
      type: String,
      optional: true
    },
    designation: String,
    employmentType: {
      type: String,
      optional: true
    },
    languages: {
      type: [Languages],
      optional: true,
      default() {
        return [];
      }
    },
    staffType: String,
    documents: {
      type: [Documents],
      optional: true,
      default() {
        return [];
      }
    },
    postings: {
      type: [Postings],
      optional: true,
      default() {
        return [];
      }
    },
    staffId: String,
    promotions: {
      type: [Promotions],
      optional: true,
      default() {
        return [];
      }
    },
    staffClass: String,
    maritalStatus: {
      type: String,
      optional: true
    },
    phone: {
      type: [String],
      optional: true,
      default() {
        return [];
      }
    },
    address: {
      type: String,
      optional: true
    },
    salaryStructure: {
      type: String,
      optional: true
    },
    stateOfOrigin: String,
    lgaOfOrigin: String,
    dateOfLastPromotion: {
      type: String,
      optional: true
    },
    postingProposed: {
      type: Boolean,
      optional: true
    },
    currentPosting: {
      type: String,
      optional: true
    }
  },
  helpers: {
    postingDuration() {
      if (this.staffType === "2") {
        const staffPosting = this.postings;

        const maxSerial = FindMax(staffPosting, "serial");

        const currentPosting = staffPosting[maxSerial - 1];

        if (currentPosting && currentPosting.postingStatus == "4") {
          const todayDate = moment(new Date());
          const postingDate = currentPosting.postingDate;
          const diffDuration = moment.duration(todayDate.diff(postingDate));
          let years = diffDuration.years();
          let months = diffDuration.months();
          let days = diffDuration.days();
          if (years && parseInt(years) >= 3) {
            //over stayed time to move
            const staff = {
              biodata: this.biodata,
              designation: this.designation,
              years,
              months,
              days,
              unit: currentPosting.unitName,
              staffId: this.staffId
            };
            return { ...staff };
          }
        }
      }
    }
  }
});

export { StaffMember, StaffMembers, Postings };
