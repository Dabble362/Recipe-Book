const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const recipeRoutes = require("./routes/recipe");
const commentRoutes = require("./routes/comment");

const path = require("path");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

// Testing React stuff
app.use(express.static(path.join(__dirname, "client/build")));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Browser Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/recipe", recipeRoutes);
app.use("/comment", commentRoutes);

// Endpoint to test connection to server for development
const connectionTestingEndpoint = "/api/testServerConnection";
app.get(connectionTestingEndpoint, (req, res) => {
    res.json({ message: `I am a message from the server at route: ${connectionTestingEndpoint}` });
  });

// Testing React routes for uncaught routes
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
  });

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
