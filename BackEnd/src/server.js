require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const APIVersionCheck = require("./middleware/versionCheck");

const app = express();

const PORT = process.env.PORT;

app.use(express.json()); // parsing the JSONBody
app.use(express.urlencoded({ extended: true })); //parsing the body(data) of FORM-DATA

//Middleware to get the Request
app.use((req, res, next) => {
  console.log(`Received Method : ${req.method} -- Request to : ${req.url}`);
  console.log(`Request Body : ${JSON.stringify(req.body)}`);
  next();
});

//API version Check
app.use(APIVersionCheck("v1"));

//HomeRoute
app.get(process.env.API_VERSION, (req, res) => {
  res.send(`Hello From the Version 1 routes `);
});

connectDB
  .authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQl");
  })
  .catch((err) => {
    console.log("Error while connecting to PostgreSql", err);
  });

connectDB
  .sync({ alter: false }) //alter  keeps data , update columns
  .then(() => {
    console.log("✅ Tables Created");
  })
  .catch((err) => {
    console.log("Error while creating tables", err);
  });

//API's Listing
app.use("/api/v1/driver", require("./routes/driver/_driverIndex"));
app.use("/api/v1/super-admin", require("./routes/superAdmin/_superAdminIndex"));

app.listen(PORT, () => {
  console.log(`Server is listening at PORT : ${PORT}`);
});
