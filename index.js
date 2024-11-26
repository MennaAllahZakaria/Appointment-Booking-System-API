const express = require("express");
const dotenv = require("dotenv");
const ApiError = require("./utils/apiError");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const mountRoutes = require("./routes/index");
const globalError = require("./middelware/errorMiddleware");
const dbConnection = require("./config/database");
//Routes
// const mountRoutes = require("./routes");
const path = require("path");
//connect with db
dbConnection();

//express app
const app = express();



// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads"))); // /name photo => in localhost

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(process.env.NODE_ENV);
}


//Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

//Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

//handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
