import { NextFunction, Request, Response } from "express";
import { client } from "../config/database";
import { apiResponse } from "../utils";
import { validationResult } from "express-validator";

interface JobDataType {
  id: string;
  title: string;
  description: string;
  expiry: string;
  created_at?: string;
  updated_at?: string;
}

const findAllJobs = async (request: Request, response: Response, next: NextFunction) => {
  client
    .query("SELECT * FROM jobs ORDER BY id ASC")
    .then((res) => {
      if (res.rows.length > 0) {
        return apiResponse(response, 200, res.rows);
      } else {
        return apiResponse(response, 422, "Not found any job");
      }
    })
    .catch((error) => {
      console.error(error);
      apiResponse(response, 500, error);
    });

  client.end;
};

const findJobById = async (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id);

  client
    .query(`SELECT * FROM jobs WHERE id = ${id}`)
    .then((res) => {
      if (res.rows.length > 0) {
        return apiResponse(response, 200, res.rows);
      } else {
        return apiResponse(response, 422, "Not found any job with this id");
      }
    })
    .catch((error) => {
      console.error(error);
      apiResponse(response, 500, error);
    });

  client.end;
};

const createNewJob = async (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return apiResponse(response, 422, errors);
  }

  const { title, description, expiry } = request.body;
  const created_at = new Date().toISOString();

  client
    .query(`INSERT INTO jobs (title, description, expiry, created_at) VALUES ($1, $2, $3, $4) RETURNING id`, [title, description, expiry, created_at])
    .then((res) => {
      if (res.rows.length > 0) {
        return apiResponse(response, 201, res.rows);
      } else {
        return apiResponse(response, 422, "Create new job failed");
      }
    })
    .catch((error) => {
      console.error(error);
      apiResponse(response, 500, error);
    });

  client.end;
};

const updateJob = async (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return apiResponse(response, 422, errors);
  }

  const { title, description, expiry } = request.body;
  const id = parseInt(request.params.id);
  const updated_at = new Date().toISOString();
  const queryString = expiry
    ? `UPDATE jobs SET title = $1, description = $2, expiry = $3, updated_at = $4 WHERE id = $5 RETURNING id`
    : `UPDATE jobs SET title = $1, description = $2, updated_at = $3 WHERE id = $4 RETURNING id`;

  client
    .query(queryString, expiry ? [title, description, expiry, updated_at, id] : [title, description, updated_at, id])
    .then((res) => {
      if (res.rows.length > 0) {
        return apiResponse(response, 200, res.rows);
      } else {
        return apiResponse(response, 422, "Update Job failed");
      }
    })
    .catch((error) => {
      console.error(error);
      apiResponse(response, 500, error);
    });

  client.end;
};

const deleteJobById = async (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id);

  if (!id) return apiResponse(response, 422, { message: "id must be provided" });

  client
    .query(`DELETE FROM jobs WHERE id = ${id}`)
    .then((res) => {
      if (res.rowCount > 0) {
        return apiResponse(response, 200, res.rows);
      } else {
        return apiResponse(response, 422, "Delete job failed");
      }
    })
    .catch((error) => {
      console.error(error);
      apiResponse(response, 500, error);
    });

  client.end;
};

export { findAllJobs, findJobById, createNewJob, updateJob, deleteJobById };
