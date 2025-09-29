import express from "express";
import authorisation from "../../../controllers/authorisation.js";
import resolvecomplaints from "../../../controllers/admin/complaint/resolvecomplaints.js";
const resolvecomplaintsforadmins = express.Router();
resolvecomplaintsforadmins.use("/resolvecomplaints",authorisation,resolvecomplaints);
export default resolvecomplaintsforadmins;