import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";
import { Postings } from "../StaffMember/StaffMemberClass";

const StaffPostings = new Mongo.Collection("staffposting");

StaffPostings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

StaffPostings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const StaffPosting = Class.create({
  name: "StaffPostings",
  collection: StaffPostings,
  fields: {
    staffId: String,
    designation: String,
    staffName: String,
    unitFrom: {
      type: String,
      optional: true
    },
    newUnit: String,
    status: String,
    startingDate: String,
    dateofPosting: String,
    previousPostings: {
      type: [Postings],
      optional: true,
      default() {
        return [];
      }
    }
  }
});

export { StaffPosting, StaffPostings };
