import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { Designation } from "../../api/Designation/DesignationClass";
import { UniversityUnit } from "../../api/UniversityUnit/UniversityUnitClass";

Meteor.methods({
  trial: function Customersmethod(excelData) {
    check(excelData, Array);
    let numSaved = 0;
    let errorArr = [];
    for (let i = 5; i < excelData.length; i++) {
      const rowArray = excelData[i];
      //loop through row data;
      //lets build the person here
      let staff = {
        biodata: {}
      };
      let canSave = false;
      for (let k = 0; k < rowArray.length; k++) {
        if (rowArray[rowArray.length] !== null) {
          if (rowArray[k] !== null) {
            //console.log(rowArray[k]);
            //here we build the object
            switch (k) {
              case 1:
                canSave = true;
                staff.staffId = rowArray[k];
                break;

              case 2:
                staff.biodata.surname = rowArray[k];
                break;
              case 3:
                staff.biodata.firstName = rowArray[k]
                  ? rowArray[k]
                  : "No firstname";
                break;
              case 4:
                staff.biodata.middleName = rowArray[k];
                break;
              case 5:
                staff.sex = rowArray[k];
                break;
              case 6:
                staff.maritalStatus = rowArray[k];
                break;
              case 7:
                staff.stateOfOrigin = rowArray[k];
                break;
              case 8:
                staff.lgaOfOrigin = rowArray[k];
                break;
              case 9:
                staff.dob = rowArray[k] ? rowArray[k] : "No date";
                break;
              case 10:
                staff.dateOfFirstAppointment = rowArray[k];
                break;
              case 11:
                staff.dateOfAppointmentInUniversity = rowArray[k];
                break;
              case 12:
                //we have certificate here
                if (rowArray[k] !== null) {
                  let certArray = rowArray[k].split(",");
                  //loop through
                  let certificateArray = [];
                  for (let j = 0; j < certArray.length; j++) {
                    let certObj = certArray[j].trim().split(" ");
                    let credentials = {
                      cert: certObj[0],
                      date: certObj[1]
                    };
                    certificateArray.push(credentials);
                  }
                  staff.certificate = certificateArray;
                }
                break;
              case 13:
                staff.dateOfLastPromotion = rowArray[k] || "No date";
                staff.employmentStatus = "active";
                break;
              case 14:
                staff.designation = rowArray[k];
                break;
              case 15:
                const salaryStructure = rowArray[k];
                const GL = rowArray[16];
                const step = rowArray[17];
                staff.salaryStructure = `${salaryStructure} ${GL} / ${step} `;
                if (
                  salaryStructure &&
                  salaryStructure.toLowerCase().trim() == "conuass"
                ) {
                  //we have an academic staff
                  staff.staffType = "Academic Staff";
                  staff.staffClass = "Senior Staff";
                } else {
                  staff.staffType = "Non Academic Staff";
                  if (GL && parseInt(GL) < 6) {
                    //we have a junior non teaching
                    staff.staffClass = "Junior Staff";
                  } else {
                    //we have a senior staff
                    staff.staffClass = "Senior Staff";
                  }
                }
                break;
            }
          }
        } else {
          break;
        }
      }
      if (canSave) {
        //we should be good to save
        try {
          let newStaff = new StaffMember(staff);
          newStaff.save();
          numSaved++;
        } catch (error) {
          //i failed here go to next item
          errorArr.push(error);
          continue;
        }
      }
    }
    console.log(`Total data saved : ${numSaved}`);
    console.log(errorArr);
    console.log(errorArr.length);
  },
  buildRanks: function Customersmethod(excelData) {
    check(excelData, Array);
    debugger;
    let numSaved = 0;
    let errorArr = [];
    let ranks = {};
    for (let i = 5; i < excelData.length; i++) {
      const rowArray = excelData[i];
      //loop through row data;
      //lets build the person here

      if (rowArray[14] !== null) {
        let cadre = rowArray[14].trim();
        if (ranks.hasOwnProperty(cadre)) {
          ranks[cadre] = ranks[cadre] + 1;
        } else {
          ranks[cadre] = 1;
        }
      }
    }
    console.log(ranks);
    //enumerate and get the keys here
    const cadreArray = Object.keys(ranks);
    let arr = [];
    const AcademicStaff = [
      "Graduate Assistant",
      "Assistant Lecturer",
      "Lecturer 11",
      "Senior Lecturer",
      "Associate Professor",
      "Professor",
      "Graduate Library Assistant",
      "Assistant Librarian",
      "Librarian 11",
      "Librarian 1",
      "Senior Librarian",
      "Deputy University Librarian",
      "University Librarian"
    ];
    let num = 0;
    for (let i = 0; i < cadreArray.length; i++) {
      const rank = cadreArray[i];
      const newDesignation = new Designation();
      newDesignation.rank = rank;
      newDesignation.save();
      num++;
      arr.push(rank);
    }
    return { arr, num };
  },
  buildUniversityUnit: function Customersmethod(excelData) {
    check(excelData, Array);
    let numSaved = 0;
    for (let i = 0; i < excelData.length; i++) {
      const rowArray = excelData[i];
      const unitName = rowArray.join(" ").trim();
      const newUnit = new UniversityUnit();
      newUnit.name = unitName;
      newUnit.save();
      numSaved++;
    }
    console.log(numSaved);
  }
});

rateLimit({
  methods: [],
  limit: 5,
  timeRange: 1000
});
