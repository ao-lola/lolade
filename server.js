const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
//set up routes

const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");

const app = express();
const db = require("./config/keys").mongoURI;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//
require("./config/passport")(passport);

// router use
app.use("/api/users", users);
app.use("/api/profiles", profiles);

mongoose
  .connect(db)
  .then(() => console.log("MongoDB is connected"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5003;

app.listen(port, () => console.log(`server is running on port ${port}`));
