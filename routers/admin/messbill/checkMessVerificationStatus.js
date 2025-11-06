import express from "express";
import { checkMessVerificationStatus } from "../../../controllers/admin/mesbill/checkMessVerificationStatus.js";

const checkMessVerificationStatusrouter = express.Router();

// Route → /api/mess/verify-status/:monthYear
checkMessVerificationStatusrouter.use("/verify-status", checkMessVerificationStatus);

export default checkMessVerificationStatusrouter;
