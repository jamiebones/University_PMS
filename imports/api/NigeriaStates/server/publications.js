import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { NigeriaStates } from "../NigeriaStatesClass";

Meteor.publish("nigeriastates.getallStates", function NigeriaStatesMethod() {
  return NigeriaStates.find();
});
