const { register } = require("../app/controllers/authController");
const handleGetRoot = require("../app/controllers/root");
const validator = require("../app/utils/validation");

const router = require("express").Router();

router.get("/", handleGetRoot);

// Register User
router.post("/api/ngaos/register", validator, register);

module.exports = router;
