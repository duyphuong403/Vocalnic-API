import { config } from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import router from "./routes/index";

config();

const app: Application = express();

app.all("/*", (request, response, next) => {
  // Allow cross-origin api requests
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, X-Auth-Token");
  response.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE");
  return next();
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Express server with TypeScript");
});

/* Routes */
app.use("/jobs", router);

/* Catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createHttpError(404));
});

/* Errors */
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
  return typeof error.toJson == "function"
    ? response.status(error.status).json(error.toJson())
    : response.status(500).json({
        error_message: error.message,
      });
});

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  console.log("\n\n>> ✅ API Server is listening on port: " + PORT);
});
