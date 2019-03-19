import { Meteor } from "meteor/meteor";
import { _ } from "meteor/underscore";
import moment from "moment";

export const FindMax = (arr, key) => {
  if (arr.length) {
    let highest = 0;
    for (let i = 0; i < arr.length; i++) {
      let currentItem = arr[i][key];
      if (currentItem > highest) {
        highest = currentItem;
      }
    }
    return highest;
  }
  return 0;
};

export const OverStayedStaff = arr => {
  let staffArray = [];
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      const staffPosting = arr[i].postings;
      const biodata = arr[i].biodata;
      const staffId = arr[i].staffId;
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
            staffId
          };
          staffArray.push(staff);
        }
      } else {
        continue;
      }
    }
  }
  if (staffArray.length) {
    const sortByDuration = staffArray.sort((a, b) => {
      return b.years - a.years;
    });
    return sortByDuration;
  }
  return staffArray;
};

export const SortPostingDuration = pArray => {
  if (pArray.length) {
    let arr = pArray.sort((a, b) => {
      return a.serial - b.serial;
    });
    let postingArray = [];
    for (let i = 0; i < arr.length; i++) {
      const posting = arr[i];
      if (posting.postingStatus == "4") {
        const startDate = posting.postingDate;
        let endDate = moment(new Date()).toISOString();
        if (i + 1 !== arr.length) {
          endDate = arr[i + 1].postingDate;
        }
        const duration = FindTimeDifference(startDate, endDate);
        const obj = {
          unit: posting.unitName,
          duration
        };
        postingArray.push(obj);
      }
      continue;
    }
    return postingArray;
  }
  return [];
};

export const FindTimeDifference = (
  startTime = moment().format("MMMM DD YYYY"),
  endTime = moment().format("MMMM DD YYYY")
) => {
  let start = moment(endTime);
  let end = moment(startTime);
  //Difference in number of days
  const diffDuration = moment.duration(start.diff(end));
  let years = diffDuration.years();
  let months = diffDuration.months();
  let days = diffDuration.days();
  years = years ? `${years} year(s)` : "";
  months = months ? `${months} month(s)` : "";
  days = days ? `${days} day(s)` : "";
  return `${years} ${months} ${days}`;
};

export const Capitalize = word => {
  if (word) {
    return word.toUpperCase();
  }
  return null;
};

export const GetNameFromUserId = userId => {
  const user = Meteor.users.find(userId).fetch();
  if (user.length > 0) {
    return `${user[0].profile.title} ${user[0].profile.name.first} ${
      user[0].profile.name.last
    }`;
  }
};

export const GetNameDetailsObjectFromId = () => {
  const user = Meteor.user();
  return {
    title: (user && user.profile.title) || "",
    firstname: user && user.profile.name.first,
    surname: user && user.profile.name.last,
    rank: 1
  };
};

export const GetEmailFromUserId = userId => {
  const user = Meteor.users.find(userId).fetch();
  if (user.length > 0) {
    return ` ${user[0].emails[0].address}`;
  }
};

export const SetTransactionId = () => {
  const date = new Date();
  const alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  let text = "";
  const components = [
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];
  for (let i = 0; i < 2; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  const id = components.join("");
  return id + text;
};

export const sumMeUp = (firstitem, seconditem) => {
  let sum = parseFloat(firstitem) + parseFloat(seconditem);
  return sum;
};

export const subtractMe = (firstitem, seconditem) => {
  let value = parseFloat(seconditem) - parseFloat(firstitem);
  return value;
};

export const IncludeDots = (time = "") => {
  let timeString = time.split("");
  let joinWords = "";
  for (let i = 0; i < timeString.length; i++) {
    if (i == 2) {
      joinWords += ":" + timeString[i];
    } else if (i == 4) {
      joinWords += ":" + timeString[i];
    } else {
      joinWords += timeString[i];
    }
  }
  return joinWords;
};

export const Title = () => {
  const title = [
    "Mr",
    "Mrs",
    "Dr",
    "Dr(Mrs)",
    "Engr",
    "Engr(Mrs)",
    "Prof",
    "Arch"
  ];
  return title;
};

export const capFirstLetter = word => {
  if (word) {
    const first = word.charAt(0).toUpperCase();
    const rest = word.slice(1);
    return first + rest;
  }
};

export const capAllFirstLetter = word => {
  if (word) {
    const arr = word.split(" ");
    let capWord = "";
    for (let i = 0; i < arr.length; i++) {
      let firstWord = arr[i];
      firstWord = firstWord.charAt(0).toUpperCase();
      let remainWord = arr[i].slice(1);
      capWord += firstWord + remainWord + " ";
    }
    return capWord.trim();
  }
};

export const GetAllUserRoles = userId => {
  return Roles.getRolesForUser(userId);
};

export const validateEmail = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

export const CompareValues = (key, order = "asc") => {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order == "desc" ? comparison * -1 : comparison;
  };
};

export const RemoveSpaces = word => {
  if (word) {
    let replaceSpace = word
      .replace(/ /g, "_")
      .replace(/\(/g, "")
      .replace(/\)/g, "");
    return replaceSpace;
  }
};

export const ReplaceSpace = word => {
  if (word) {
    let replaceWord = word.replace(/_/g, " ");
    return replaceWord;
  }
};

export const setInputHeight = (defaultHeight, element) => {
  if (element) {
    // Support passing an event and a raw element from refs;
    const target = element.target ? element.target : element;
    target.style.height = `${defaultHeight}px`;
    target.style.height = `${target.scrollHeight}px`;
  }
};

export const StripHtml = html => {
  if (Meteor.isClient) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
};

export const StatesInNigeria = () => {
  const state = [
    { state_id: 1, state_name: "Abia" },
    { state_id: 2, state_name: "Adamawa" },
    { state_id: 3, state_name: "Akwa Ibom" },
    { state_id: 4, state_name: "Anambra" },
    { state_id: 5, state_name: "Bauchi" },
    { state_id: 6, state_name: "Bayelsa" },
    { state_id: 7, state_name: "Benue" },
    { state_id: 8, state_name: "Borno" },
    { state_id: 9, state_name: "Cross River" },
    { state_id: 10, state_name: "Delta" },
    { state_id: 11, state_name: "Ebonyi" },
    { state_id: 12, state_name: "Edo" },
    { state_id: 13, state_name: "Ekiti" },
    { state_id: 14, state_name: "Enugu" },
    { state_id: 15, state_name: "Gombe" },
    { state_id: 16, state_name: "Imo" },
    { state_id: 17, state_name: "Jigawa" },
    { state_id: 18, state_name: "Kaduna" },
    { state_id: 19, state_name: "Kano" },
    { state_id: 20, state_name: "Katsina" },
    { state_id: 21, state_name: "Kebbi" },
    { state_id: 22, state_name: "Kogi" },
    { state_id: 23, state_name: "Kwara" },
    { state_id: 24, state_name: "Lagos" },
    { state_id: 25, state_name: "Nasarawa" },
    { state_id: 26, state_name: "Niger" },
    { state_id: 27, state_name: "Ogun" },
    { state_id: 28, state_name: "Ondo" },
    { state_id: 29, state_name: "Osun" },
    { state_id: 30, state_name: "Oyo" },
    { state_id: 31, state_name: "Plateau" },
    { state_id: 32, state_name: "Rivers" },
    { state_id: 33, state_name: "Sokoto" },
    { state_id: 34, state_name: "Taraba" },
    { state_id: 35, state_name: "Yobe" },
    { state_id: 36, state_name: "Zamfara" },
    { state_id: 37, state_name: "FCT" }
  ];
  return state;
};

export const Universities = () => {
  const status = [
    { key: "University of Uyo", value: "University of Uyo" },
    { key: "University of Benin", value: "University of Benin" },
    { key: "University of Jada", value: "University of Jada" }
  ];
  return status;
};
