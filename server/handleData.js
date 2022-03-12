const fs = require("fs");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

module.exports = function handleData(list, type) {
  const today = new Date().toLocaleDateString("fa-IR").split("/");

  if (type === "csv") {
    const csvWriter = createCsvWriter({
      path: `data/${today.join("-")}.csv`,
      header: [
        { id: "lable", title: "Lable" },
        { id: "timespan", title: "Timespan" },
        { id: "timeperiod", title: "Timeperiod" },
      ],
    });

    const data = list.map((value) => ({
      lable: value.lable === "" ? "nolable" : value.lable,
      timespan: `${value.timespan.start} to ${value.timespan.end}`,
      timeperiod: value.timeperiod,
    }));

    csvWriter
      .writeRecords(data)
      .then(() => console.log("The CSV file was written successfully"));
  } else if (type === "json") {
    const data = JSON.stringify(list)
    fs.writeFile(`data/${today.join("-")}.json`, data, (err) => {
      if (err) throw new Error(err.message)
      console.log("The JSON file was written successfully");
    })
  }
};
