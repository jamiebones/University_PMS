import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Cadres } from "../CadreClass";

Meteor.publish("cadre.getAllCadres", function allCadreMethod() {
  return Cadres.find();
});
