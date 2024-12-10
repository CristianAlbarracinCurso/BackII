const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/userController.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current",
  passport.authenticate("jwt", { session: false }),
  getCurrentUser
);

module.exports = router;
