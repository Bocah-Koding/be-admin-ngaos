const express = require("express");
const morgan = require("morgan");
const router = require("../config/routes");
const methodOverride = require("method-override");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const yaml = require("js-yaml");
const fs = require("fs");
const swaggerUI = require("swagger-ui-express");

const swaggerDocument = yaml.load(fs.readFileSync("docs/openapi.yml", "utf8"));

const app = express();

//route api-document swagger
app.use(
  "/api/ngaos/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

/** Install request logger */
app.use(morgan("dev"));

// Install JSON Request Parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// method override
app.use(methodOverride("_method"));

app.use(router);

module.exports = app;
