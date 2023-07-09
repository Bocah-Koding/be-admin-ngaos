const {
  register,
  registerAdmin,
  login,
} = require("../app/controllers/authController");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductData,
  getProductById,
} = require("../app/controllers/productController");
const handleGetRoot = require("../app/controllers/root");
const {
  getAllUserData,
  getUserById,
} = require("../app/controllers/userController");
const { authorize } = require("../app/middleware/authorize");
const validator = require("../app/utils/validation");

const router = require("express").Router();

const prefix = "/api/ngaos";

router.get("/api/ngaos", handleGetRoot);

// Register User
router.post(prefix + "/register", validator, register);

// Register Admin
router.post(prefix + "/registerAdmin", authorize, validator, registerAdmin);

// Login
router.post(prefix + "/login", login);

// Get All Data Users
router.get(prefix + "/users", authorize, getAllUserData);

// get user by id
router.get(prefix + "/users/:id", authorize, getUserById);

// create product
router.post(prefix + "/product", authorize, validator, createProduct);

// get all product
router.get(prefix + "/product", getAllProductData);

// get product by id
router.get(prefix + "/product/:productId", getProductById);

// update product
router.put(prefix + "/product/:productId", authorize, validator, updateProduct);

// delete product
router.delete(prefix + "/product/:productId", authorize, deleteProduct);

module.exports = router;
