import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { UniversityCadres } from "../UniversityCadreClass";
import moment from "moment";

Meteor.publish("universityCadre.getAllCadres", function UniversityCadre() {
  return UniversityCadres.find({}, { sort: { serial: 1 } });
});
