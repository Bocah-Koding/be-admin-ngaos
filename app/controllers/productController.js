const { Product } = require("../models");
const { v4: uuid } = require("uuid");
const cloudinary = require("./cloudinary");

module.exports = {
  async createProduct(req, res) {
    const isAdmin = req.user.role;
    const { name, description, image, category, price } = req.body;
    if (isAdmin == "admin") {
      if (req.file == null) {
        res.status(400).json({
          status: "failed",
          message: "you must input image",
        });
      } else {
      }
    } else {
      res.status(403).json({
        status: "error",
        message: "access denied",
      });
    }
  },
};
