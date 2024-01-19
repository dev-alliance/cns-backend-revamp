import * as dotenv from "dotenv";
dotenv.config();
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
import customFields from "./routes/customFields";
import contracts from "./routes/contracts";
import categories from "./routes/categories";
import health from "./routes/health";
import company from "./routes/compony";
import approval from "./routes/approval";
import role from "./routes/role";

const PORT: number = config.get<number>("port");
const MONGOURI = config.get<string>("mongoURI");
// const MONGOURI = `mongodb://localhost:27017/cns`;
sgMail.setApiKey(config.get("sendgridKey"));

const app = express();
app.use(
  cors({
    origin: (origin, callback) => callback(null, origin || "*"),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/health", health);
app.use("/api/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/users", users);
app.use("/api/v1/folders", folders);
app.use("/api/v1/branches", branches);
app.use("/api/v1/templates", templates);
app.use("/api/v1/clauses", clauses);
app.use("/api/v1/customFields", customFields);
app.use("/api/v1/tags", tags);
app.use("/api/v1/teams", teams);
app.use("/api/v1/contracts", contracts);
app.use("/api/v1/categories", categories);
app.use("/api/v1/companies", company);
app.use("/api/v1/approvals", approval);
app.use("/api/v1/role", role);

if (!config.get("jwtPrivateKey")) {
  log.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect(MONGOURI, { autoIndex: true })
  .then(() => {
    app.listen(PORT, () => {
      log.info(`server port ${PORT}`);
      swaggerDocs(app, PORT);
    });
  })
  .catch((err) => log.error(err));
