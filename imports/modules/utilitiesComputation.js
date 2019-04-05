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
