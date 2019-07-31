import { Meteor } from "meteor/meteor";
import { SalaryScales } from "../../SalaryScale/SalaryScaleClass";

Meteor.publish("salaryscale.getSalaryInDb", function SalaryScaleMethod() {
  return SalaryScales.find();
});
