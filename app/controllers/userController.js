const { User } = require("../models");

module.exports = {
  async getAllUserData(req, res) {
    const isAdmin = req.user.role;
    if (isAdmin == "admin") {
      const findAll = () => {
        return User.findAll();
      };
      try {
        const dataUsers = await findAll();
        if (!dataUsers) {
          res.status(404).json({
            status: "failed",
            message: "Data user not found",
          });
        }
        res.status(200).json({
          status: "success",
          message: "Get All Data User Success",
          data: dataUsers,
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
    } else {
      res.status(403).json({
        status: "error",
        message: "access denied",
      });
    }
  },

  async getUserById(req, res) {
    try {
      const isAdmin = req.user.role;
      const idUser = req.params.id;
      const findUserId = () => {
        return User.findOne({
          where: { id: idUser },
        });
      };
      if (isAdmin == "admin") {
        const dataUser = await findUserId();

        if (!dataUser) {
          res.status(404).json({
            status: "failed",
            message: "User not found",
          });
        }

        res.status(200).json({
          status: "success",
          message: "Get All Data User Successfully",
          data: dataUser,
        });
      } else {
        res.status(403).json({
          status: "error",
          message: "access denied",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
};
