import { _ } from "meteor/underscore";
import { StaffMembers } from "../../api/StaffMember/StaffMemberClass";
class Staff {
  constructor(staffData) {
    const { biodata, official, qualifications } = staffData;
    this.biodata = biodata;
    this.official = official;
    this.qualifications = qualifications;
  }

  __checkValues() {
    const {
      firstName,
      title,
      middleName,
      surname,
      stateOfOrigin,
      phone,
      sex,
      maritalStatus,
      dob,
      selectedLga,
      address
    } = this.biodata;
    const {
      dateOfFirstAppointment,
      dateOfUniversityAppointment,
      staffId,
      staffType,
      staffClass,
      employmentType,
      designation,
      department,
      step,
      salaryLevel,
      salaryScale
    } = this.official;
    const { certificates } = this.qualifications;
    let error = {};
    if (firstName == "" || firstName == undefined) {
      error.firstname = "first name of staff is required";
    }
    if (title == "0" || title == undefined) {
      error.title = "staff title is required";
    }
    if (surname == "" || surname == undefined) {
      error.surname = "surname of staff is required";
    }
    if (stateOfOrigin == "0" || stateOfOrigin == undefined) {
      error.stateOfOrigin = "state of origin of staff is required";
    }

    if (maritalStatus == "0" || maritalStatus == undefined) {
      error.maritalStatus = "marital status is required";
    }

    if (dob == "" || dob == undefined) {
      error.dob = "date of birth is required";
    }
    if (sex == "0" || sex == undefined) {
      error.sex = "sex of staff is required";
    }
    if (selectedLga == "0" || selectedLga == undefined) {
      error.lga = "lga of origin of staff is required";
    }

    if (address == "" || address == undefined) {
      error.stateOfOrigin = "contact address of staff is required";
    }

    if (dateOfFirstAppointment == "" || dateOfFirstAppointment == undefined) {
      error.dateOfFirstAppointment = "date of first appointment is required";
    }

    if (
      dateOfUniversityAppointment == "" ||
      dateOfUniversityAppointment == undefined
    ) {
      error.dateOfUniversityAppointment =
        "date of appointment in the University of Uyo is required";
    }

    if (staffId == "" || staffId == undefined) {
      error.staffId = "staff id is required";
    }

    if (staffType == "0" || staffType == undefined) {
      error.staffType = "staff type is required";
    }

    if (staffClass == "0" || staffClass == undefined) {
      error.staffClass = "class of staff is required";
    }

    if (employmentType == "0" || employmentType == undefined) {
      error.employmentType = "employment type of staff is required";
    }

    if (designation == "" || designation == undefined) {
      error.designation = "designation of staff is required";
    }

    if (department == "" || department == undefined) {
      error.department = "department of staff is required";
    }

    if (step == "" || step == undefined) {
      error.step = "salary step is required";
    }

    if (salaryLevel == "" || salaryLevel == undefined) {
      error.salaryLevel = "salary level step is required";
    }

    if (salaryScale == "" || salaryScale == undefined) {
      error.salaryScale = "salary scale is required";
    }

    if (certificates == undefined || certificates.length == 0) {
      error.certificates = "staff credential is required.";
    }

    return error;
  }

  saveStaff(cb) {
    //check if we pass validation
    const validationObject = this.__checkValues();
    if (_.isEmpty(validationObject)) {
      //we are good here
      //no errors let check for a staffId;
      const {
        dateOfFirstAppointment,
        dateOfUniversityAppointment,
        staffId,
        staffType,
        staffClass,
        employmentType,
        designation,
        department,
        step,
        salaryLevel,
        salaryScale
      } = this.official;
      const {
        firstName,
        title,
        middleName,
        surname,
        stateOfOrigin,
        phone,
        sex,
        maritalStatus,
        dob,
        selectedLga,
        address
      } = this.biodata;

      const { certificate } = this.qualifications;

      const staff = {
        dob: dob,
        sex: sex,
        certificate: certificate,
        dateOfFirstAppointment: dateOfFirstAppointment,
        dateOfAppointmentInUniversity: dateOfUniversityAppointment,
        employmentStatus: employmentType,
        designation: designation.toUpperCase(),
        staffType,
        staffId: staffId.toUpperCase(),
        staffClass,
        maritalStatus,
        phone,
        address,
        salaryStructure: `${salaryScale.toUpperCase()} ${step}/${salaryLevel}`,
        stateOfOrigin: stateOfOrigin,
        lgaOfOrigin: selectedLga,
        currentPosting: department,
        officialRemark: employmentType,
        biodata: {
          title,
          firstName,
          middleName,
          surname
        }
      };
      return cb(null, staff);
    } else {
      return cb(validationObject, null);
    }
  }
}

export { Staff };
