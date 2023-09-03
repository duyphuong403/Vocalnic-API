import cors from "cors";
import { config } from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import helmet from "helmet";
import createHttpError from "http-errors";
import { Mutation } from "./graphql/mutation";
import { RootQuery } from "./graphql/query";

config();

const app: Application = express();

app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.static("public"));

// Use Graphql
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

app.use("/graphql", graphqlHTTP({ schema, graphiql: process.env.NODE_ENV !== "production" }));

/* Catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createHttpError(404));
});

app.use(helmet);

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
