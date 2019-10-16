import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";
import { Postings } from "../StaffPosting/StaffPostingClass";
import { FindMax } from "../../modules/utilities";
import moment from "moment";

const StaffMembers = new Mongo.Collection("staffmembers");

if (Meteor.isServer) {
  StaffMembers._ensureIndex({ staffId: 1 });
  StaffMembers._ensureIndex({ staffId: 1, designation: 1 });
}

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

const Promotion = Class.create({
  name: "Promotion",
  fields: {
    designation: String,
    salaryStructure: String,
    promotionYear: String,
    serial: Number
  }
});

const Documents = Class.create({
  name: "Documents",
  fields: {
    documentId: String,
    serial: Number
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
    promotions: {
      type: [Promotion],
      optional: true,
      default() {
        return [];
      }
    },
    staffId: String,
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
    },
    officialRemark: {
      type: String,
      optional: true
    },
    pensionPFA: {
      type: String,
      optional: true
    },
    pensionPIN: {
      type: String,
      optional: true
    },
    emailAddress: {
      type: String,
      optional: true
    },
    expirationDateofContractandTheRest: {
      type: String,
      optional: true
    }
  }
});

export { StaffMember, StaffMembers, Postings, Promotion };
