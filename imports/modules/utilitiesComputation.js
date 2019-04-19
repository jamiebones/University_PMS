import moment from "moment";

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
  console.log(sortArray);
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
  //filter and remove years less than 35
  const dueToRetire = staffArray.filter(staff => {
    // const employmentDate = staff.dateOfAppointmentInUniversity;
    // const startDate = moment(employmentDate);
    // const service = moment.duration(moment().diff(startDate));
    const todayDate = moment();
    if (staff.staffType == "1") {
      //retirement age 70 years
      //return people with 2 years left
      const age = moment(staff.dob);
      const diffAge = moment.duration(todayDate.diff(age));
      let staffAge = diffAge.years();
      const yearsLeft = 70 - parseInt(staffAge);
      if (yearsLeft <= 2) {
        return staff;
      }
    } else {
      const age = moment(staff.dob);
      const diffAge = moment.duration(todayDate.diff(age));
      let staffAge = diffAge.years();
      const yearsLeft = 65 - parseInt(staffAge);
      if (yearsLeft <= 2) {
        return staff;
      }
    }
  });
  for (let i = 0; i < dueToRetire.length; i++) {
    const staff = dueToRetire[i];
    const employmentDate = dueToRetire[i].dateOfAppointmentInUniversity;
    const staffType = dueToRetire[i].staffType;
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
    const age = dueToRetire[i].dob;
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
  console.log(sortArray);
  return sortArray;
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
