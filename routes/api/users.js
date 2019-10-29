const express = require("express");
const router = express.Router();

//@Route get api/users/test route
//@desc test users route

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

module.exports = router;
