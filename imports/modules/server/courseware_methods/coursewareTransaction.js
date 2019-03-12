import CoursewareTransaction from "../../../api/CoursewareTransaction/CoursewareTransaction";
import Courseware from "../../../api/Courseware/Courseware";
import moment from "moment";
import ProcessRemitaData from "../Remita/processRemitaData";
import GenerateRRR from "../Remita/generateRRR";
import { _ } from "meteor/underscore";

const __CheckForUnpaidRRR = options => {
  return new Promise((resolve, reject) => {
    try {
      //check if the student has an unpaid RRR for
      //that course less than two weeks
      let { coursewareId, regNum } = options;
      const regex = new RegExp("-", "g");
      regNum = regNum.replace(regex, "/");
      const coursewareTrans = CoursewareTransaction.findOne({
        "student_details.regNum": regNum,
        coursewareID: coursewareId,
        RRR: { $exists: true, $ne: null },
        successful: false
      });

      //check if transaction exists first
      if (coursewareTrans !== undefined) {
        //we have a match
        //check if the RRR has been generated more than two weeks
        const transDate = coursewareTrans.date;
        const todayDate = moment(new Date());
        const duration = moment.duration(todayDate.diff(transDate));
        const days = duration.asDays();
        if (parseInt(days) < 14) {
          //we can make use of this RRR and orderID
          resolve({
            generateNewRRR: false,
            Remita: {
              orderID: coursewareTrans.transactionId,
              RRR: coursewareTrans.RRR
            }
          });
        } else {
          //lets generate a new RRR from remita here
          resolve({
            generateNewRRR: true,
            Remita: null
          });
        }
      } else {
        resolve({
          generateNewRRR: true,
          Remita: null
        });
      }
    } catch (error) {
      console.log(error);
      //send me a mail here
      reject(error);
    }
  });
};

const __GetCoursewareAmount = ({ coursewareId }) => {
  //find the particular course_ware and send the amount from the
  //function
  return new Promise((resolve, reject) => {
    try {
      const courseware = Courseware.findOne({ _id: coursewareId });
      if (!_.isEmpty(courseware)) {
        resolve(courseware && courseware.amount);
      } else {
        reject("The selected course ware does not exist");
      }
    } catch (error) {
      console.log(error);
      //send me a mail
      reject(error);
    }
  });
};

const __SaveCoursewareTransaction = options => {
  return new Promise((resolve, reject) => {
    try {
      //save a new courseware transaction
      let {
        amount,
        transactionId,
        name,
        transactionStatus,
        email,
        regNum,
        courseware_title,
        coursewareId
      } = options;
      const regex = new RegExp("-", "g");
      regNum = regNum.replace(regex, "/");
      const student_details = {
        name,
        email,
        regNum
      };
      const transData = {
        courseware_title,
        amount,
        student_details,
        coursewareID: coursewareId,
        transactionId,
        transactionStatus,
        successful: false
      };
      resolve(CoursewareTransaction.insert(transData));
    } catch (error) {
      console.log(error);
      //send me a mail
      reject(error);
    }
  });
};

export default (GenerateRemitaRRR = async options => {
  //check if we are to regenerate RRR
  const { email, name, transactionId } = options;
  const coursewareAmount = await __GetCoursewareAmount(options);

  //here we check if there is an RRR less than two weeks
  const { generateNewRRR, Remita } = await __CheckForUnpaidRRR(options);
  if (generateNewRRR) {
    //then we need to contact remita
    //cause we need to generate new RRR
    //put the data we are sending to remita here
    const data = {
      transactionId,
      total: coursewareAmount,
      email,
      name
    };

    options.amount = coursewareAmount;
    await __SaveCoursewareTransaction(options);
    //function we send to procress remita data function;
    const processedData = await ProcessRemitaData(data);
    //contact remita
    const response = await GenerateRRR(processedData);
    return response;
  } else {
    //no need to regenerate a new RRR
    const response = {};
    const { orderID, RRR } = Remita;
    response.content = {
      orderID,
      RRR,
      statuscode: "025"
    };
    const result = JSON.stringify(response.content);
    response.content = result;
    return response;
  }
});
