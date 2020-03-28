import moment from "moment";
import { GetDetailsBasedOnRole } from "./utilities";

export const FindStaffDueForPromotion = staffArray => {
  const careerPeak = [
    "VICE CHANCELLOR",
    "PROFESSOR",
    "PROFESSOR (DEAN)",
    "REGISTRAR",
    "DIRECTOR",
    "DIRECTOR, HEALTH SERVICES",
    "DIRECTOR INTERNAL AUDITOR",
    "PROFESSOR (DVC)",
    "PROFESSOR (DIRECTOR)",
    "PROFESSOR (PROVOST)",
    "BURSAR"
  ];
  console.time();
  //filter and remain promotion years greater than 3
  const promotionArray = staffArray.filter(staff => {
    const promotionDate = staff.dateOfLastPromotion;
    const todayYear = moment().year();
    const promotionYear = promotionDate && promotionDate.split("-").pop();
    const diff = parseInt(todayYear) - parseInt(promotionYear);
    return (
      parseInt(diff) >= 3 &&
      !careerPeak.includes(staff.designation.toUpperCase())
    );
  });
  console.timeEnd();
  return promotionArray;
};

export const FindTimeDifference = staffArray => {
  let computedArray = [];
  console.time();
  //filter and remove years less than 35
  const lessThan35Years = staffArray.filter(staff => {
    const employmentDate = staff.dateOfAppointmentInUniversity;
    const startDate = moment(employmentDate);
    const service = moment.duration(moment().diff(startDate));
    return parseInt(service.years()) >= 35;
  });
  for (let i = 0; i < lessThan35Years.length; i++) {
    const staff = lessThan35Years[i];
    const employmentDate = lessThan35Years[i].dateOfAppointmentInUniversity;
    const staffType = lessThan35Years[i].staffType;
    const startDate = moment(employmentDate);
    const todayDate = moment();
    //Difference in number of days
    const diffDuration = moment.duration(todayDate.diff(startDate));
    let years = diffDuration.years();
    let months = diffDuration.months();
    let days = diffDuration.days();
    years = years ? `${years} year(s)` : "";
    months = months ? `${months} month(s)` : "";
    days = days ? `${days} day(s)` : "";

    //find the persons age
    const age = lessThan35Years[i].dob;
    const ageToDate = moment(age);
    const diffAge = moment.duration(todayDate.diff(ageToDate));
    let staffAge = diffAge.years();

    staff.periodSpent = `${years} ${months} ${days}`;
    staff.age = staffAge;
    // if (parseInt(diffDuration.years()) >= 35) {
    let yearsToretirement = null;
    if (staffType == "1") {
      //academic staff
      yearsToretirement = 70 - staffAge;
      staff.yearsToretirement = yearsToretirement;
      computedArray.push(staff);
    } else {
      //non teaching staff
      yearsToretirement = 65 - staffAge;
      staff.yearsToretirement = yearsToretirement;
      computedArray.push(staff);
    }
    //}
  }

  //sort the array
  const sortArray = computedArray.sort((a, b) => {
    return a.yearsToretirement - b.yearsToretirement;
  });
  console.timeEnd();
  //console.log(sortArray);
  return sortArray;
};

const __GetOverStayedStaff = arr => {
  return new Promise((resolve, reject) => {
    //loop through the array
    let staffArray = [];
    if (arr.length) {
      for (let i = 0; i < arr.length; i++) {
        const staffPosting = arr[i].postings;
        const biodata = arr[i].biodata;
        const staffId = arr[i].staffId;
        const salaryStructure = arr[i].salaryStructure;
        const postings = arr[i].postings;
        //find the max
        if (staffPosting.length < 1) continue;
        const maxSerial = FindMax(staffPosting, "serial");
        const currentPosting = staffPosting[maxSerial - 1];

        const designation = arr[i].designation;
        if (currentPosting && currentPosting.postingStatus == "4") {
          //we have a successful posting let's find how
          //long they have stayed
          const todayDate = moment(new Date());
          const postingDate = currentPosting.postingDate;
          const diffDuration = moment.duration(todayDate.diff(postingDate));
          let years = diffDuration.years();
          let months = diffDuration.months();
          let days = diffDuration.days();
          if (years && parseInt(years) >= 3) {
            //over stayed time to move
            const staff = {
              biodata,
              designation,
              years,
              months,
              days,
              unit: currentPosting.unitName,
              staffId,
              salaryStructure,
              postings
            };
            staffArray.push(staff);
          }
        } else {
          continue;
        }
      }
    }

    resolve(staffArray);
  });
};

export const OverStayedStaff = async arr => {
  //let staffArray = [];
  if (arr.length) {
    //lets split the array into 2
    let startArray = [];
    let endArray = [];
    if (arr.length % 2 === 0) {
      //we have a perfect split
      startArray = arr.slice[(0, arr.length / 2)];
      endArray = arr.slice[(arr.length / 2, arr.length)];
    } else {
      //we have a decimal number
      const midPoint = Math.floor(arr.length / 2);
      startArray = arr.slice(0, midPoint);
      endArray = arr.slice(midPoint, arr.length);
    }
    let finalArray = [
      ...(await __GetOverStayedStaff(startArray)),
      ...(await __GetOverStayedStaff(endArray))
    ];

    if (finalArray.length) {
      const sortByDuration = finalArray.sort((a, b) => {
        return b.years - a.years;
      });
      return sortByDuration;
    }
  }
};

export const AcademicSalaryScale = () => {
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

export const NonTeachingSalaryScale = () => {
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

export const NonTeachingPromotionPlacement = step => {
  let newStep = null;
  //const salaryScale = NonTeachingSalaryScale();
  switch (step) {
    case 1:
      newStep = step - 2;
      break;
    case 2:
      newStep = step - 2;
      break;
    case 3:
      newStep = step - 2;
      break;
    case 4:
      newStep = step - 2;
      break;
    case 5:
      newStep = step - 2;
      break;
    case 6:
      newStep = step - 2;
      break;
    case 7:
      newStep = step - 2;
      break;
    case 8:
      newStep = step - 2;
      break;
    case 9:
      newStep = step - 2;
      break;
    case 11:
      newStep = step - 1;
      break;
    case 12:
      newStep = step - 2;
    case 13:
      newStep = step - 2;
    case 14:
      newStep = step - 2;
    case 15:
      newStep = step - 2;
  }
  return newStep;
};

export const TeachingStaffPromotionPlacement = step => {
  let newStep = null;
  //const salaryScale = NonTeachingSalaryScale();
  switch (step) {
    case 1:
      newStep = step - 2;
      break;
    case 2:
      newStep = step - 2;
      break;
    case 3:
      newStep = step - 2;
      break;
    case 4:
      newStep = step - 2;
      break;
    case 5:
      newStep = step - 2;
      break;
    case 6:
      newStep = step - 2;
      break;
    case 7:
      newStep = step - 2;
      break;
  }
  return newStep;
};

export const FindNextRank = (cadreArray, currentRank) => {
  //loop through
  let newRank = { cadre: null, scale: null };
  for (let i = 0; i < cadreArray.length; i++) {
    const cadreRank = cadreArray[i];
    const index = cadreRank.findIndex(
      x => x.cadre.toUpperCase() == currentRank.toUpperCase()
    );
    if (index != -1) {
      //we have a match here
      newRank = cadreRank[index + 1];
      break;
    }
    continue;
  }
  return newRank;
};

export const CalculateDueForRetirement = staffArray => {
  let computedArray = [];
  console.time();
  const todayDate = moment(new Date());
  const dueToRetire = staffArray.filter(staff => {
    if (staff.staffType == "1") {
      //retirement age 70 years
      //return people with 2 years left
      const age = moment(staff.dob);
      const diffAge = moment.duration(todayDate.diff(age));
      let staffAge = diffAge.years();
      const yearsLeft = 70 - parseInt(staffAge);
      if (yearsLeft == 1) {
        return staff;
      }
    } else {
      const age = moment(staff.dob);
      const diffAge = moment.duration(todayDate.diff(age));
      let staffAge = diffAge.years();
      const yearsLeft = 65 - parseInt(staffAge);
      if (yearsLeft == 1) {
        return staff;
      }
    }
  });
  for (let i = 0; i < dueToRetire.length; i++) {
    const staff = dueToRetire[i];
    const age = moment(staff.dob);
    const diffAge = moment.duration(todayDate.diff(age));
    let staffAge = diffAge.years();

    //months left to retire
    let bDayArray = staff.dob && staff.dob.split("-");
    let bday = bDayArray[0];
    let bMonth = bDayArray[1];
    let bYear = new Date().getFullYear();

    let staffRetirementBday = moment(`${bday}-${bMonth}-${bYear}`);

    let yearDiff = moment.duration(staffRetirementBday.diff(todayDate));

    const diffBMonth = yearDiff.months();
    const diffBDay = yearDiff.days();
    const timeLeft = __filterMinus(diffBMonth, diffBDay);

    let yearsToretirement = null;
    staff.timeLeft = timeLeft;
    if (staff.staffType == "1") {
      //academic staff
      yearsToretirement = 70 - staffAge;
      computedArray.push(staff);
    } else {
      //non teaching staff
      yearsToretirement = 65 - staffAge;
      computedArray.push(staff);
    }
    //}
  }

  console.timeEnd();
  return computedArray;
};

const __RemoveDash = (year, months, days) => {
  let y = year.toString().replace("-", "");
  let m = months.toString().replace("-", "");
  let d = days.toString().replace("-", "");
  if (y.trim() == "0" && m.trim() == "0" && d.trim() == "0") {
    return "Retiring today";
  } else {
    y = y != "0" ? `${y} year(s)` : "";
    m = m != "0" ? `${m} month(s)` : "";
    d = d != "0" ? `${d} day(s)` : "";
    return `Retired ${y} ${m} ${d} ago`;
  }
};

const __filterMinus = (years, months, days) => {
  if (
    years.toString().includes("-") ||
    days.toString().includes("-") ||
    months.toString().includes("-")
  ) {
    return __RemoveDash(months, days);
  } else {
    let y = years;
    let m = months;
    let d = days;
    y = y != "0" ? `${y} year(s)` : "";
    m = m != "0" ? `${m} month(s)` : "";
    d = d != "0" ? `${d} day(s)` : "";
    return `Retiring in ${y} ${m} ${d}`;
  }
};

export const GetDateInYearsMonthDay = passedDate => {
  const todayDate = moment(new Date());
  const diffDuration = moment.duration(todayDate.diff(passedDate));
  let years = diffDuration.years();
  let months = diffDuration.months();
  let days = diffDuration.days();
  years = years ? `${years} years` : "";
  months = months ? `${months} months` : "";
  days = days ? `${days} days` : "";
  return `${years} ${months} ${days}`;
};

export const CalculateStaffDueForRetirementNew = (staffArray, years) => {
  let computedArray = [];
  console.time();
  const todayDate = moment(new Date());
  //get the salary type
  //loop through
  const staffScheduleToRetire = staffArray.filter(staff => {
    const staffSalary = staff.salaryStructure;
    const age = moment(staff.dob || todayDate);
    //const diffAge = moment.duration(todayDate.diff(age));
    let staffAge = Math.round(todayDate.diff(age, "days") / 365);
    //console.log(staffAge);
    if (staffSalary && staffSalary.toUpperCase().includes("CONTISS")) {
      const yearsLeft = 65 - parseInt(staffAge);
      if (yearsLeft == years) {
        //console.log(Math.round(todayDate.diff(age, "days") / 365));
        staff.retirementType = "CONTISS";
        return staff;
      }
    } else if (staffSalary && staffSalary.toUpperCase().includes("CONMESS")) {
      const yearsLeft = 60 - parseInt(staffAge);
      if (yearsLeft == years) {
        staff.retirementType = "CONMESS";
        return staff;
      }
    } else if (staffSalary && staffSalary.toUpperCase().includes("CONUASS")) {
      //check if the person should be in the professorial cadre
      if (
        staff.designation.toUpperCase().includes("PROFESSOR") ||
        staff.designation.toUpperCase().includes("VICE CHANCELLOR")
      ) {
        const yearsLeft = 70 - parseInt(staffAge);
        if (yearsLeft == years) {
          staff.retirementType = "CONUASS";
          return staff;
        }
      } else {
        //the person is not in the professorial cadre yet
        //so they retire at 65
        const yearsLeft = 65 - parseInt(staffAge);
        if (yearsLeft == years) {
          staff.retirementType = "CONUASS";
          return staff;
        }
      }
    }
  });

  for (let i = 0; i < staffScheduleToRetire.length; i++) {
    const staff = staffScheduleToRetire[i];
    const age = moment(staff.dob);
    const diffAge = moment.duration(todayDate.diff(age));
    let staffAge = diffAge.years();
    let bday = age.date();
    let bMonth = age.month() + 1;
    let bYear = new Date().getFullYear();
    let staffRetirementBday = moment(`${bMonth}/${bday}/${bYear + years}`);

    let yearDiff = moment.duration(staffRetirementBday.diff(todayDate));
    //console.log(yearDiff);
    const diffBMonth = yearDiff.months();
    const diffBDay = yearDiff.days();
    const diffYear = yearDiff.years();
    const timeLeft = __filterMinus(diffYear, diffBMonth, diffBDay);

    staff.timeLeft = timeLeft;
    computedArray.push(staff);
    //return computedArray;
    continue;
  }
  console.timeEnd();
  return computedArray;
};

function FilterByTimeLeft(timeLeft, timeRange) {
  let timeString = timeLeft && timeLeft.toString();
  if (timeString && timeString.includes("-")) {
    //person already retired
    const remain = timeString.replace("-", "");
    if (parseInt(remain) <= timeRange) {
      return `${true}: Retired`;
    } else {
      return false;
    }
  } else {
    //person yet to retire
    if (parseInt(timeString) <= timeRange) {
      return `${true} : Retiring`;
    } else {
      return false;
    }
  }
}

export const GetStaffQueryType = () => {
  let query = [];
  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    query.push(
      {
        staffType: { $in: ["2", "3"] }
      },
      { staffClass: "Senior Staff" }
    );
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    query.push({ staffClass: "Junior Staff" }, { staffType: "2" });
  }

  if (GetDetailsBasedOnRole("ASE", "Personnel")) {
    //query.staffType = "1";
    query.push({
      staffType: { $in: ["1", "3"] }
    });
  }

  return query;
};

export const ShowPromotionTabOrNot = salary => {
  if (salary == undefined || salary == "undefined") return;
  if (salary && salary.toUpperCase().includes("CONSOLIDATED")) {
    return false;
  }
  //let's split the salary
  let salarySplitArray = salary && salary.split(" ");
  let salaryLevel = salarySplitArray[1].split("/")[0];
  if (salarySplitArray[0].toUpperCase() === "CONTISS") {
    if (salaryLevel === "15") {
      return false;
    }
  }
  if (salarySplitArray[0].toUpperCase() === "CONUASS") {
    if (salaryLevel === "7") {
      return false;
    }
  }
  if (salarySplitArray[0].toUpperCase() === "CONMESS") {
    if (salaryLevel === "15") {
      return false;
    }
  }
  return true;
};
