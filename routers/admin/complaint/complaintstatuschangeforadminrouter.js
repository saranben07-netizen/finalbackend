import express from "express";
import complaintstatuschangeforadmin from "../../../controllers/admin/complaint/complaintstatuschangeforadmin.js";
import authorisation from "../../../controllers/authorisation.js";
const complaintstatuschangeforadminrouter = express.Router();
complaintstatuschangeforadminrouter.use("/complaintstatuschangeforadmin",authorisation,complaintstatuschangeforadmin);
export default complaintstatuschangeforadminrouter;
