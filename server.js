const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//set up routes
const admin = require("./routes/api/admin");
const users = require("./routes/api/users");

const app = express();
const db = require("./config/keys").mongoURI;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World"));

// router use
app.use("/api/admin", admin);
app.use("/api/users", users);

mongoose
  .connect(db)
  .then(() => console.log("MongoDB is connected"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5003;

app.listen(port, () => console.log(`server is running on port ${port}`));
