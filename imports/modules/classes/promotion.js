import { _ } from "meteor/underscore";
import {
  NonTeachingPromotionPlacement,
  TeachingStaffPromotionPlacement,
  RemoveFirstZero
} from "../utilitiesComputation";
import { FindMax, FindMin } from "../utilities";

class Promotion {
  constructor({
    biodata,
    staffId,
    lastPromotionDate,
    salaryStructure,
    designation
  }) {
    this.biodata = biodata;
    this.staffId = staffId;
    this.lastPromotionDate = lastPromotionDate;
    this.salaryStructure = salaryStructure;
    this.designation = designation;
    this.__newDesignation = null;
    this.__newStep = null;
    this.__newSalaryStructure = null;
  }

  getNewSalaryStructure(rankArray) {
    // get the next rank from the rankArray
    for (let i = 0; i < rankArray.length - 1; i += 1) {
      if (this.__newDesignation != null) break;
      const rankObj = rankArray[i];
      // destructure the rank object
      const { cadreRank } = rankObj;
      // loop through the rank obj and find the next rank
      for (let j = 0; j < cadreRank.length - 1; j += 1) {
        const { rank } = cadreRank[j];
        // lets perform our check here
        if (this.designation.toUpperCase() === rank.toUpperCase()) {
          // we have found a match the next rank will be the next item
          // check if there is still an item in the array
          if (cadreRank[j + 1]) {
            // the person gets the next rank
            // find the person new salary scale here
            // split the salary structure here to get the step
            const scale = cadreRank[j + 1].level;
            const salaryStep = this.salaryStructure.trim();
            // split the salarystep by space
            const salaryArray = salaryStep && salaryStep.split("/");
            // split the first part to extract the type
            const scaleArray = salaryArray[0].split(" ");
            const scaleType = scaleArray[0];
            const step = parseInt(salaryArray[salaryArray.length - 1]);
            let newStep = null;
            let newSalaryStructure = null;
            if (scaleType.toUpperCase() === "CONTISS") {
              newStep = NonTeachingPromotionPlacement(step);
              newSalaryStructure = `${scaleType} ${scale}/${newStep}`;
            } else if (scaleType.toUpperCase() === "CONUASS") {
              // find conmess salary structure
              newStep = TeachingStaffPromotionPlacement(step);
              newSalaryStructure = `${scaleType} ${scale}/${newStep}`;
            } else {
              // others like conmess
            }
            this.__newStep = newStep;
            this.__newSalaryStructure = newSalaryStructure;
            break;
          }
          break;
        }
      }
    }
    // return the value here
    return {
      newStep: this.__newStep,
      newSalaryScale: this.__newSalaryStructure
    };
  }

  getSalaryRange(array) {
    const salaryObject = {};
    if (this.__newSalaryStructure == null) {
      salaryObject.yearlySalary = "#0000.000";
      salaryObject.yearlySalaryRange = "#0000.00 - 0000.00";
      return salaryObject;
    }
    // get the new designation and the salary scale;
    const salaryStep = this.__newSalaryStructure;
    // split the salarystep by space
    const salaryArray = salaryStep && salaryStep.split("/");
    // split the first part to extract the type
    const newSalaryScale = salaryArray[0].trim();
    const salaryScaleRange = array.find(
      salary => salary.salaryType === newSalaryScale.toUpperCase()
    );

    if (!_.isEmpty(salaryScaleRange)) {
      // lets get the annual amount here and the range of salary here
      const step = salaryArray[1].trim();
      // get the salary for that step
      const annualScale = salaryScaleRange.scale.find(
        salary => salary.step === step
      );

      const annualSalary = annualScale && annualScale.amount;
      // find the salaryscale range
      const scaleArray = salaryScaleRange && salaryScaleRange.scale;
      const maxAnnualScale = FindMax(
        salaryScaleRange && salaryScaleRange.scale,
        "step"
      );
      const minAnnualScale = FindMin(
        salaryScaleRange && salaryScaleRange.scale,
        "step"
      );

      // get the scale range
      const scaleStart = scaleArray.find(
        salary => salary.step === minAnnualScale
      );

      const scaleEnd = scaleArray.find(
        salary => salary.step === maxAnnualScale
      );

      salaryObject.yearlySalary = annualSalary;
      salaryObject.yearlySalaryRange = `${scaleStart.amount} - ${scaleEnd.amount}`;
    } else {
      // we have not entered it yet
      salaryObject.yearlySalary = "#0000.000";
      salaryObject.yearlySalaryRange = "#0000.00 - 0000.00";
    }
    return salaryObject;
  }
}

export { Promotion };
