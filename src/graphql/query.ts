import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { JobType } from "./type";
import { db } from "../config/database";

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    jobs: {
      type: new GraphQLList(JobType),
      args: {
        id: { type: GraphQLInt },
        page: { type: GraphQLInt },
        size: { type: GraphQLInt },
      },
      async resolve(_, args) {
        const { id, page = 0, size = 10 } = args;

        const query = id ? `SELECT * FROM jobs WHERE id = $1 ORDER BY created_at DESC` : `SELECT * FROM jobs ORDER BY created_at DESC OFFSET $1 LIMIT $2`;

        const values = id ? [id] : [page > 1 ? (page - 1) * size : 0, size];

        try {
          const result = await db.many(query, values);
          return result;
        } catch (err) {
          return err;
        }
      },
    },
    getAllJobs: {
      type: new GraphQLList(JobType),
      async resolve() {
        const query = `SELECT * FROM jobs ORDER BY created_at DESC`;

        try {
          const result = await db.many(query);
          return result;
        } catch (err) {
          return err;
        }
      },
    },
    getTotalJobs: {
      type: new GraphQLList(JobType),
      async resolve() {
        const query = `SELECT COUNT(id) FROM jobs RETURN `;

        try {
          const result = await db.many(query);
          return result;
        } catch (err) {
          return err;
        }
      },
    },
  },
});
