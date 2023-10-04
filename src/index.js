require("dotenv").config();
const bodyParser = require("body-parser");
const config = require("config");
const express = require("express");
const { default: mongoose } = require("mongoose");
const sgMail = require("@sendgrid/mail");
const morgan = require("morgan");
const cors  = require('cors')
const app = express();
const swaggerDocs = require("./utils/swagger")

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

app.use("/uploads",express.static("uploads"))
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const PORT = process.env.PORT || 8000;
const MONGOURI = process.env.mongoURI || config.get("mongoURI");
sgMail.setApiKey(process.env.email);

const auth = require("./routes/auth");
const cns = require('./routes/users')
const folders = require("./routes/folders")
const branches = require("./routes/branches")
const templates = require("./routes/templates")
const clauses = require("./routes/clauses")
const permisisons = require("./routes/permissions")
const customFields = require("./routes/customFields")
const tags = require("./routes/tags")
const teams = require("./routes/teams");
const admin = require("./routes/admin");
const users = require("./routes/users")


mongoose
  .connect(MONGOURI, { useNewUrlParser: true })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

  
app.use("/api/auth", auth);
app.use("/api/v1/admin", admin);
app.use('/api/v1/users',users)
app.use('/api/v1/folders',folders)
app.use('/api/v1/branches',branches)
app.use('/api/v1/templates',templates)
app.use('/api/v1/clauses',clauses)
app.use('/api/v1/permissions',permisisons)
app.use('/api/v1/customFields',customFields)
app.use('/api/v1/tags',tags)
app.use('/api/v1/teams',teams)


app.listen(PORT, () => {
  console.log(`server port ${PORT}`)
  swaggerDocs(app,PORT)
});
