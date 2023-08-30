import { Router } from "express";
import { createNewJob, deleteJobById, findAllJobs, findJobById, updateJob } from "../api/Job";
import { validateJob } from "../middlewares/jobValidator";

const router = Router();

router.get("/", findAllJobs);
router.get("/:id", findJobById);
router.post("/create", validateJob(), createNewJob);
router.put("/update/:id", validateJob(), updateJob);
router.delete("/:id", deleteJobById);

export default router;
