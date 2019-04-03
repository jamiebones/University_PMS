import moment from "moment";

export const FindTimeDifference = staffArray => {
  let computedArray = [];
  console.time();
  for (let i = 0; i < staffArray.length; i++) {
    const staff = staffArray[i];
    const employmentDate = staffArray[i].dateOfAppointmentInUniversity;
    const staffType = staffArray[i].staffType;
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
    const age = staffArray[i].dob;
    const ageToDate = moment(age);
    const diffAge = moment.duration(todayDate.diff(ageToDate));
    let staffAge = diffAge.years();

    staff.periodSpent = `${years} ${months} ${days}`;
    staff.age = staffAge;
    //if (parseInt(diffDuration.years()) >= 35) {
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
    }
  }

  //sort the array
  const sortArray = computedArray.sort((a, b) => {
    return a.yearsToretirement - b.yearsToretirement;
  });
  console.timeEnd();
  console.log(sortArray);
  return sortArray;
};
