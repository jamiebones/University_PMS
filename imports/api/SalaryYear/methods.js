import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffMembers } from "../../api/StaffMember/StaffMemberClass";
import { SalaryYears, SalaryYear } from "../../api/SalaryYear/SalaryYearClass";
import { _ } from "meteor/underscore";

const AcademicSalaryScale = () => {
  const scaleArray = [
    "",
    { step: 1, max: 6 },
    { step: 2, max: 8 },
    { step: 3, max: 8 },
    { step: 4, max: 9 },
    { step: 5, max: 13 },
    { step: 6, max: 10 },
    { step: 7, max: 10 }
  ];
  return scaleArray;
};

const NonTeachingSalaryScale = () => {
  const scaleArray = [
    "",
    { step: 1, max: 15 },
    { step: 2, max: 15 },
    { step: 3, max: 15 },
    { step: 4, max: 15 },
    { step: 5, max: 15 },
    { step: 6, max: 15 },
    { step: 7, max: 15 },
    { step: 8, max: 15 },
    { step: 9, max: 15 },
    { step: 10, max: 11 },
    { step: 11, max: 11 },
    { step: 12, max: 11 },
    { step: 13, max: 9 },
    { step: 14, max: 9 },
    { step: 15, max: 9 }
  ];
  return scaleArray;
};

Meteor.methods({
  "salaryYear.applyAnnualIncrement": function SalaryYearFunction(year) {
    check(year, String);
    console.time();
    const findYear = SalaryYears.findOne({ year: year });
    //check if we have a year
    if (!_.isEmpty(findYear)) {
      //we have an increment for that year
      throw new Meteor.Error(
        "Year Exist",
        `Increment has already been done for ${year}`
      );
    } else {
      //new year we need to
      //check if we are in october of that year
      const month = new Date().getMonth();
      if (month == 9) {
        //we are good run the query
        const allstaff = StaffMembers.find().fetch();
        console.log(allstaff.length);
        for (let i = 0; i < allstaff.length; i++) {
          const staff = allstaff[i];
          //get the staff
          const staffType = staff.staffType;
          const salaryStructure = staff.salaryStructure;
          const salaryArray = salaryStructure.trim().split(" ");
          if (staffType == "1") {
            //academic staff
            const grade = salaryArray[0];
            const level = salaryArray[1];
            let step = salaryArray[3];
            //check the step increment for that level
            //find the current level and possible step increment

            const stepProgression = AcademicSalaryScale().find(el => {
              return el.step == level;
            });

            if (
              stepProgression &&
              stepProgression.max > step &&
              grade.toUpperCase() == "CONUASS"
            ) {
              //increment our step here
              const newSalaryStructure = `${grade} ${level}/ ${parseInt(step) +
                1}`;
              StaffMembers.update(staff._id, {
                $set: { salaryStructure: newSalaryStructure }
              });
            }
          } else {
            //non academic staff
            const grade = salaryArray[0];
            const level = salaryArray[1];
            let step = salaryArray[3];
            //check the step increment for that level
            //find the current level and possible step increment
            const stepProgression = NonTeachingSalaryScale().find(el => {
              return el.step == level;
            });
            if (
              stepProgression &&
              stepProgression.max > step &&
              grade.toUpperCase() == "CONTISS"
            ) {
              //increment our step here
              const newSalaryStructure = `${grade} ${level}/ ${parseInt(step) +
                1}`;
              StaffMembers.update(staff._id, {
                $set: { salaryStructure: newSalaryStructure }
              });
            }
          }
        }
      } else {
        throw new Meteor.Error(
          "Not Increament Month",
          "Increament is done in October"
        );
      }
    }
    const addYear = new SalaryYear();
    addYear.year = year;
    addYear.save();
    console.log(console.timeEnd());
  }
});
