import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { SalaryScale, Scale } from "../../api/SalaryScale/SalaryScaleClass";
import { _ } from "meteor/underscore";

Meteor.methods({
  "salaryScale.saveSalaryStructure": function SalaryScalemethod(
    salaryScaleObj
  ) {
    check(salaryScaleObj, Object);
    const { scale, stepNumber, salaryArray } = salaryScaleObj;
    //first check if we have such exact scale
    const salaryType = `${scale} ${stepNumber}`;
    const findScale = SalaryScale.findOne({ salaryType: salaryType });

    if (!_.isEmpty(findScale)) {
      //we have that scale already
      throw new Meteor.Error(
        `${salaryType} already in the system. Update it if you want to make changes to it.`
      );
    }
    //loop through the salaryArray and create a scale obj
    let salaryScaleArray = [];
    for (let i = 0; i < salaryArray.length - 1; i++) {
      const salary = salaryArray[i];
      const newStep = new Scale({
        step: salary.step,
        amount: salary.amount
      });
      salaryScaleArray.push(newStep);
    }

    const newsalaryScale = new SalaryScale({
      scale: salaryScaleArray,
      salaryType: salaryType
    });

    return newsalaryScale.save();
  },
  "salaryscale.addnewstep": function SalaryScalemethod(newStep) {
    check(newStep, Object);
    const { salaryType, step, amount } = newStep;
    const findScale = SalaryScale.findOne({ salaryType: salaryType });
    if (!_.isEmpty(findScale)) {
      const scale = findScale.scale;
      const newScale = new Scale({
        amount,
        step
      });
      scale.push(newScale);
      return findScale.save();
    }
  },
  "salaryscale.editstep": function SalaryScalemethod(editStep) {
    check(editStep, Object);
    const { step, amount, stepEdited } = editStep;
    const findScale = SalaryScale.findOne({
      salaryType: stepEdited.salaryType
    });
    if (!_.isEmpty(findScale)) {
      const scale = findScale.scale;
      const newScale = new Scale({
        amount,
        step
      });
      //filter out the old step
      let remainScale = scale.filter(e => {
        return e.step != stepEdited.step;
      });
      remainScale.push(newScale);
      findScale.scale = remainScale;
      return findScale.save();
    }
  }
});
