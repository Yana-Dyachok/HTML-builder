const fs = require("fs");
const path = require("path");
const filePathTxt = path.join(__dirname, "text.txt");
const stream = fs.createReadStream(filePathTxt);
stream.on("data", (data) => {
  console.log(data.toString());
});
stream.on("get error", (error) => {
  console.error(error);
});