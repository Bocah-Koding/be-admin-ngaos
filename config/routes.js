const {
  register,
  registerAdmin,
  login,
} = require("../app/controllers/authController");
const handleGetRoot = require("../app/controllers/root");
const { authorize } = require("../app/middleware/authorize");
const validator = require("../app/utils/validation");

const router = require("express").Router();

const prefix = "/api/ngaos";

router.get("/", handleGetRoot);

// Register User
router.post(prefix + "/register", validator, register);

// Register Admin
router.post(prefix + "/registerAdmin", authorize, validator, registerAdmin);

// Login
router.post(prefix + "/login", login);

module.exports = router;
