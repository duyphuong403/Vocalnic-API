import { body } from "express-validator";

const validateJob = () => {
  return [
    body("title", "Title cannot be empty").trim().notEmpty(),
    body("description", "Description cannot be empty").trim().notEmpty(),
    body("expiry", "Expiry is invalid").trim().isISO8601().toDate().optional({ nullable: true }),
  ];
};

export { validateJob };
