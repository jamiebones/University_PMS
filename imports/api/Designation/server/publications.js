import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Designations } from "../DesignationClass";
import { Cadres } from "../../Cadre/CadreClass";

Meteor.publish("designation.getAllDesignations", function DesignationMethod() {
  return [Designations.find(), Cadres.find()];
});
