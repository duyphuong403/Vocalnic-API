import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";
import { JobType } from "./type";
import { db } from "../config/database";

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createJob: {
      type: JobType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        expiry: { type: GraphQLString },
      },
      async resolve(_, args) {
        const created_at = new Date();
        const { title, description, expiry } = args;
        const expiryParsed = new Date(expiry);

        const query = `INSERT INTO jobs (title, description, expiry, created_at) VALUES ($1, $2, $3, $4) RETURNING created_at`;

        const values = [title, description, expiryParsed, created_at];

        try {
          const result = await db.one(query, values);
          return result;
        } catch (err) {
          return err;
        }
      },
    },
    updateJob: {
      type: JobType,
      args: {
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        expiry: { type: GraphQLString },
      },
      async resolve(_, args) {
        const updated_at = new Date();
        const { id, title, description, expiry } = args;
        const expiryParsed = new Date(expiry);

        const query = `UPDATE jobs SET title = $1, description = $2, expiry = $3, updated_at = $4 WHERE id = $5 RETURNING updated_at`;

        const values = [title, description, expiryParsed, updated_at, id];

        try {
          const result = await db.one(query, values);
          return result;
        } catch (err) {
          return err;
        }
      },
    },
    deleteJob: {
      type: JobType,
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(_, args) {
        const { id } = args;

        const query = `DELETE FROM jobs WHERE id = $1 RETURNING id`;

        const value = [id];

        try {
          const result = await db.one(query, value);
          return result;
        } catch (err) {
          return err;
        }
      },
    },
  },
});
