const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { v4: uuid } = require("uuid");
const { findEmail } = require("./emailController");
// const nodemailer = require("nodemailer");
const cloudinary = require("./cloudinary");
const salt = 10;

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, encryptedPassword) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encryptedPassword);
    });
  });
}

function checkPassword(encryptedPassword, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
      if (!!err) {
        reject(err);
        return;
      }
      resolve(isPasswordCorrect);
    });
  });
}

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
}

module.exports = {
  async register(req, res) {
    try {
      const password = await encryptPassword(req.body.password);
      const { name, email, phone } = req.body;
      if (req.file == null) {
        // check email and password is not empty
        if (!email || !password) {
          return res.status(400).json({
            status: "error",
            message: "Email and password is required",
          });
        }

        // validator email format using regex
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            status: "error",
            message: "Email format is invalid",
          });
        }

        // check if email already exist
        const emailUser = await findEmail(email);
        if (emailUser) {
          return res.status(400).json({
            status: "Error",
            message: "Email already Exist",
            data: {},
          });
        }

        const userForm = await User.create({
          id: uuid(),
          name: name,
          password: password,
          email: email,
          phone: phone,
          role: "member",
        });

        res.status(201).json({
          status: "success",
          message: "register success",
          data: userForm,
        });
      } else {
        const fileBase64 = req.file.buffer.toString("base64");
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;

        cloudinary.uploader.upload(
          file,
          { folder: "employee-ngaos" },
          async function (err, result) {
            if (!!err) {
              res.status(400).json({
                status: "Upload Fail",
                errors: err.message,
              });
              return;
            }

            const userForm = await User.create({
              id: uuid(),
              name: name,
              password: password,
              email: email,
              phone: phone,
              image_profile: result.url,
              role: "member",
            });

            res.status(201).json({
              status: "success",
              data: userForm,
            });
          }
        );
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  },

  async registerAdmin(req, res) {
    const password = await encryptPassword(req.body.password);
    const isAdmin = req.user.role;
    const { name, email, phone } = req.body;

    if (isAdmin !== "super admin") {
      res.status(401).json({
        message: "Unauthorized access is prohibited",
      });
    }

    if (req.file == null) {
      // check email and password is not empty
      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Email and password is required",
        });
      }

      // validator email format using regex
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Email format is invalid",
        });
      }

      // check if email already exist
      const emailUser = await findEmail(email);
      if (emailUser) {
        return res.status(400).json({
          status: "Error",
          message: "Email already Exist",
          data: {},
        });
      }

      const userForm = await User.create({
        id: uuid(),
        name: name,
        password: password,
        email: email,
        phone: phone,
        role: "admin",
      });

      res.status(201).json({
        status: "success",
        message: "register success",
        data: userForm,
      });
    } else {
      const fileBase64 = req.file.buffer.toString("base64");
      const file = `data:${req.file.mimetype};base64,${fileBase64}`;

      cloudinary.uploader.upload(
        file,
        { folder: "admin-ngaos" },
        async function (err, result) {
          if (!!err) {
            res.status(400).json({
              status: "Upload Fail",
              errors: err.message,
            });
            return;
          }

          const userForm = await User.create({
            id: uuid(),
            name: name,
            password: password,
            email: email,
            phone: phone,
            image_profile: result.url,
            role: "admin",
          });

          res.status(201).json({
            status: "success",
            data: userForm,
          });
        }
      );
    }
  },

  async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "email not found",
      });
      return;
    }

    const isPasswordCorrect = await checkPassword(user.password, password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "Password salah!",
      });
      return;
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    res.status(201).json({
      token: token,
      email: user.email,
      role: user.role,
    });
  },

  async whoami(req, res) {
    res.status(200).json(req.user);
  },
};
