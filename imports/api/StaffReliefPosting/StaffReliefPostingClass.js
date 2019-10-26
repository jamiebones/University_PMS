import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const StaffReliefPostings = new Mongo.Collection("staffreliefpostings");

StaffReliefPostings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

StaffReliefPostings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const StaffReliefPosting = Class.create({
  name: "StaffReliefPostings",
  collection: StaffReliefPostings,
  fields: {
    reliever_staffId: String,
    reliever_designation: String,
    reliever_department: String,
    reliever_staffName: String,
    staff_relivedStaffId: String,
    staff_relivedName: String,
    staff_relivedDesignation: String,
    staff_relivedDepartment: String,
    reliefStart: String,
    reliefEnd: String,
    reliefDepartment: String,
    status: String,
    letterRef: {
      type: String,
      optional: true
    }
  }
});

export { StaffReliefPosting, StaffReliefPostings };
