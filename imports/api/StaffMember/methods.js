import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import {
  StaffMember,
  StaffMembers,
  Promotion
} from "../../api/StaffMember/StaffMemberClass";
import {
  Designation,
  Designations
} from "../../api/Designation/DesignationClass";
import { UniversityUnit } from "../../api/UniversityUnit/UniversityUnitClass";
import { ActivityLog } from "../../api/ActivityLog/ActivityLogClass";
import { FindStaffDueForPromotion } from "../../modules/utilitiesComputation";
import { FindMax } from "../../modules/utilities";
import { _ } from "meteor/underscore";

Meteor.methods({
  trial: function Customersmethod(excelData) {
    check(excelData, Array);
    let numSaved = 0;
    let errorArr = [];
    let faculty = "";
    let numUnitSaved;
    let designationArray = [];
    const RemoveNull = arr => {
      return arr.filter(el => {
        return el != null;
      });
    };
    for (let i = 4; i < excelData.length; i++) {
      const rowArray = excelData[i];
      //loop through row data;
      //lets build the person here
      let staff = {
        biodata: {}
      };
      let canSave = false;
      if (rowArray[1] == null) {
        //this role is likely a unit
        const universityFaculty = RemoveNull(rowArray)
          .join(" ")
          .trim();
        faculty = universityFaculty;
        const newUnit = new UniversityUnit();
        newUnit.name = faculty;
        newUnit.save();
        numUnitSaved += 1;
      }
      for (let k = 0; k < rowArray.length; k++) {
        if (rowArray[rowArray.length] !== null) {
          if (rowArray[k] !== null) {
            //console.log(rowArray[k]);
            //here we build the object
            switch (k) {
              case 1:
                canSave = true;
                staff.staffId = rowArray[k];
                staff.currentPosting = faculty;
                //console.log(faculty);
                break;

              case 2:
                staff.biodata.surname = rowArray[k].trim();
                break;
              case 3:
                staff.biodata.firstName = rowArray[k].trim()
                  ? rowArray[k]
                  : "No firstname";
                break;
              case 4:
                staff.biodata.middleName = rowArray[k] && rowArray[k].trim();
                break;
              case 5:
                staff.sex = rowArray[k] && rowArray[k].trim();
                break;
              case 6:
                staff.maritalStatus = rowArray[k] && rowArray[k].trim();
                break;
              case 7:
                staff.stateOfOrigin = rowArray[k] && rowArray[k].trim();
                break;
              case 8:
                staff.lgaOfOrigin = rowArray[k] && rowArray[k].trim();
                break;
              case 9:
                staff.dob = rowArray[k] ? rowArray[k].trim() : "No date";
                break;
              case 10:
                staff.dateOfFirstAppointment =
                  rowArray[k] && rowArray[k].trim();
                break;
              case 11:
                staff.dateOfAppointmentInUniversity =
                  rowArray[k] && rowArray[k].trim();
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
                      cert: certObj.splice(0, certObj.length - 1).join(" "),
                      date: certObj[certObj.length - 1]
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
                staff.designation = rowArray[k] && rowArray[k].trim();

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
                  staff.staffType = "1";
                  staff.staffClass = "Senior Staff";
                } else {
                  staff.staffType = "2";
                  staff.postingProposed = false;
                  if (GL && parseInt(GL) < 6) {
                    //we have a junior non teaching
                    //build designation here as either junior
                    //or senior staff
                    staff.staffClass = "Junior Staff";
                    //get the designation here
                    const staffDesignation =
                      rowArray[14] && rowArray[14].trim();
                    //check if this is already stored in
                    //the designation array
                    const findDesignation = designationArray.find(
                      des => des.rank == staffDesignation
                    );
                    //check if we have something inside
                    if (_.isEmpty(findDesignation)) {
                      //we need to add the designation here
                      const obj = {
                        rank: staffDesignation,
                        type: "Junior Staff"
                      };
                      //push into the array
                      designationArray.push(obj);
                    }
                  } else {
                    //we have a senior staff
                    staff.staffClass = "Senior Staff";
                    const staffDesignation =
                      rowArray[14] && rowArray[14].trim();
                    const findDesignation = designationArray.find(
                      des => des.rank == staffDesignation
                    );
                    //check if we have something inside
                    if (_.isEmpty(findDesignation)) {
                      //we need to add the designation here
                      const obj = {
                        rank: staffDesignation,
                        type: "Senior Staff"
                      };
                      //push into the array
                      designationArray.push(obj);
                    }
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
          errorArr.push(staff);
          continue;
        }
      }
    }
    //done with our members lets save the designation
    for (let i = 0; i < designationArray.length; i++) {
      const staffDesObj = designationArray[i];
      const newDesination = new Designation();
      newDesination.rank = staffDesObj.rank;
      newDesination.type = staffDesObj.type;
      newDesination.save();
    }
    console.log(`Total data saved : ${numSaved}`);
    console.log(`Designation length : ${designationArray.length}`);
    console.log(`University unit saved : ${numUnitSaved}`);
    console.log(errorArr);
    console.log(errorArr.length);
  },
  buildUniversityUnit: function Customersmethod(excelData) {
    check(excelData, Array);
    let numSaved = 0;
    for (let i = 0; i < excelData.length; i++) {
      debugger;
      const rowArray = excelData[i];
      const unitName = rowArray.join(" ").trim();
      const newUnit = new UniversityUnit();
      newUnit.name = unitName;
      newUnit.save();
      numSaved++;
    }
    console.log(numSaved);
    return numSaved;
  },
  "staffMembers.editStaffState": function StaffMethods(lga, state, staffId) {
    check(lga, String);
    check(state, String);
    check(staffId, String);
    //find the member
    const editStaff = StaffMember.findOne({ staffId: staffId });
    editStaff.stateOfOrigin = state;
    editStaff.lgaOfOrigin = lga;
    editStaff.save();
  },

  "staffMembers.addCertificate": function StaffMethods(
    cert,
    date,
    staffId,
    user
  ) {
    check(cert, String);
    check(date, String);
    check(staffId, String);
    check(user, String);
    //find the member
    const editStaff = StaffMember.findOne({ staffId: staffId });
    const obj = {
      cert: cert,
      date: date.toString()
    };
    editStaff.certificate.push(obj);
    editStaff.save();

    const newActivity = new ActivityLog();
    newActivity.username = Meteor.userId();
    newActivity.name = user;
    newActivity.activityTime = new Date().toISOString();
    newActivity.actionTaken = `Added certificate: ${cert} || year obtained ${date}`;
    newActivity.type = "added certificate";
    newActivity.save();
  },

  "staffMembers.saveChanges": function StaffMethods(object) {
    check(object, Object);
    const { sex, maritalStatus, title, staffId } = object;
    //find the member
    const editStaff = StaffMember.findOne({ staffId: staffId });
    editStaff.sex = sex;
    editStaff.maritalStatus = maritalStatus;
    editStaff.biodata.title = title;
    editStaff.save();
  },

  "staffMembers.promoteStaff": function StaffMethods(promotionObject) {
    check(promotionObject, Object);
    //find the member
    const {
      staffId,
      staffName,
      oldDesignation,
      newDesignation,
      oldSalaryStructure,
      newSalaryStructure,
      oldPromotionDate,
      promotionYear,
      user
    } = promotionObject;
    const promotedStaff = StaffMember.findOne({ staffId: staffId });
    promotedStaff.designation = newDesignation;
    promotedStaff.dateOfLastPromotion = `1-Oct-${promotionYear}`;
    //find max of promotions
    let maxIndex = FindMax(promotedStaff.promotions, "serial");
    maxIndex += 1;
    //create new promotion object
    const newPromotion = new Promotion();
    newPromotion.designation = newDesignation;
    newPromotion.salaryStructure = newSalaryStructure;
    newPromotion.promotionYear = promotionYear;
    newPromotion.serial = maxIndex;

    promotedStaff.promotions.push(newPromotion);

    promotedStaff.save();

    const newActivity = new ActivityLog();
    newActivity.username = Meteor.userId();
    newActivity.name = user;
    newActivity.activityTime = new Date().toISOString();
    newActivity.actionTaken = `Changing the designation of ${staffName} from ${oldDesignation} on ${oldSalaryStructure} to ${newDesignation} on ${newSalaryStructure} and promotion year from ${oldPromotionDate} to ${promotionYear} `;
    newActivity.type = "promotion";
    newActivity.save();
  }
});

rateLimit({
  methods: [],
  limit: 5,
  timeRange: 1000
});
