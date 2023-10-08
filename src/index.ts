import bodyParser from "body-parser";
import config from "config";
import express from "express";
import mongoose from "mongoose";
import sgMail from "@sendgrid/mail";
import morgan from "morgan";
import cors from "cors";
import swaggerDocs from "./utils/swagger";
import log from "./utils/logger";

import auth from "./routes/auth";
import folders from "./routes/folders";
import branches from "./routes/branches";
import tags from "./routes/tags";
import teams from "./routes/teams";
import admin from "./routes/admin";
import users from "./routes/users";
import templates from "./routes/templates";
import clauses from "./routes/clauses";
import permisisons from "./routes/permissions";
import customFields from "./routes/customFields";

const PORT: number = config.get("port");
const MONGOURI = config.get<string>("mongoURI");
sgMail.setApiKey(config.get("sendgridKey"));

const app = express();

app.use("/uploads", express.static("uploads"));
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/users", users);
app.use("/api/v1/folders", folders);
app.use("/api/v1/branches", branches);
app.use("/api/v1/templates", templates);
app.use("/api/v1/clauses", clauses);
app.use("/api/v1/permissions", permisisons);
app.use("/api/v1/customFields", customFields);
app.use("/api/v1/tags", tags);
app.use("/api/v1/teams", teams);

if (!config.get("jwtPrivateKey")) {
  log.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect(MONGOURI)
  .then(() => {
    app.listen(PORT, () => {
      log.info(`server port ${PORT}`);
      swaggerDocs(app, PORT);
    });
  })
  .catch((err) => log.error(err));
