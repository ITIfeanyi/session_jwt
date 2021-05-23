const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;
require("./model/db");

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loginpage = require("./route/index");
app.use("/", loginpage);

app.listen(PORT, () => console.log(`Application running on port 3000`));
