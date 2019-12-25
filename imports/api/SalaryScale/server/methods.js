import { Meteor } from "meteor/meteor";
import { SalaryScales } from "../../SalaryScale/SalaryScaleClass";

Meteor.methods({
  "salaryscale.getSalaryScaleGroup": function SalaryScaleMethod() {
    const result = SalaryScales.find().fetch();
    let contiss = [];
    let conuass = [];
    let conmess = [];

    result.map(salary => {
      if (salary && salary.salaryType.includes("CONTISS")) {
        contiss.push(salary);
      }
      if (salary && salary.salaryType.includes("CONUASS")) {
        conuass.push(salary);
      }
      if (salary && salary.salaryType.includes("CONMESS")) {
        conmess.push(salary);
      }
    });
    const salaryObject = {
      contiss,
      conuass,
      conmess
    };
    return salaryObject;
  }
});
