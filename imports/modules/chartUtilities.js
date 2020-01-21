export const CleanUpDataStaffByOrigin = data => {
  const dataMap = data.map(({ _id, count }) => {
    const newObj = {
      state: _id,
      count: +count
    };
    return newObj;
  });

  const xValue = d => d.count;
  const yValue = d => d.state;

  return {
    data: dataMap,
    xValue,
    yValue,
    chartTitle: "Statistics of Workers in University of Uyo by State",
    xAxisTitle: "numbers",
    left: 100
  };
};

export const CleanUpDataByLgaOrigin = data => {
  const dataMap = data.map(({ _id, count }) => {
    const newObj = {
      lga: _id,
      count: +count
    };
    return newObj;
  });

  const xValue = d => d.count;
  const yValue = d => d.lga;

  return {
    data: dataMap,
    xValue,
    yValue,
    chartTitle: "Statistics of Workers By LGA",
    xAxisTitle: "numbers",
    left: 200,
    svgHeight: 7000
  };
};

export const CleanUpDataStaffType = (data, type) => {
  const dataMap = data.map(({ _id, count }) => {
    const newObj = {
      designation: _id,
      count: +count
    };
    return newObj;
  });

  const xValue = d => d.count;
  const yValue = d => d.designation;

  return {
    data: dataMap,
    xValue,
    yValue,
    chartTitle: `${type} staff statistics`,
    xAxisTitle: "numbers",
    left: 300,
    svgHeight: type == "Non Teaching" ? 7000 : undefined,
    bottom: type == "Non Teaching" ? 150 : undefined
  };
};

export const CleanUpDataSexDistribution = data => {
  const dataMap = data.map(({ _id, count }) => {
    const newObj = {
      sex: _id.toUpperCase() === "M" ? "MALE" : "FEMALE",
      count: +count
    };
    return newObj;
  });

  const xValue = d => d.count;
  const yValue = d => d.sex;

  return {
    data: dataMap,
    xValue,
    yValue,
    chartTitle: `staff statistics distribution by sex`,
    xAxisTitle: "numbers",
    svgHeight: 500,
    left: 80
  };
};
