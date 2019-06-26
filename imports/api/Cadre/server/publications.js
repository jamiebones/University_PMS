import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Cadres } from "../CadreClass";
import { SalaryScales } from "../../SalaryScale/SalaryScaleClass";

Meteor.publish("cadre.getAllCadres", function allCadreMethod() {
  return Cadres.find();
});

Meteor.publish("cadres.getcadresandSalaryScale", function allCadreMethod() {
  return [Cadres.find(), SalaryScales.find()];
});
