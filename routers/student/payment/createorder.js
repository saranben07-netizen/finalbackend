import  express from "express";
import createorder from "../../../controllers/student/payment/createorder.js";
const createorderrouter = express.Router();
createorderrouter.use("/create-order",createorder);
export default createorderrouter