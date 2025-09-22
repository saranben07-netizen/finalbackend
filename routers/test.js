import express from "express";
import test1 from "../controllers/test1.js";
const test = express.Router();
test.use("/test",test1);
export default test;