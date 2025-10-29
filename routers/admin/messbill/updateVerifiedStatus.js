import express from "express";
import { updateVerifiedStatus } from "../../../controllers/admin/mesbill/updateVerifiedStatus.js";

const updateVerifiedStatusrouter = express.Router();

// ✅ POST route to update verified field
updateVerifiedStatusrouter.post("/update-verified-status", updateVerifiedStatus);

export default updateVerifiedStatusrouter;
