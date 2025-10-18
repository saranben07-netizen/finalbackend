import express from 'express';
import showMessBillsByStudentId from '../../../controllers/student/payment/billsfetch.js';

const showMessBillsByIdRouter = express.Router();

showMessBillsByIdRouter.post('/showmessbillbyid1', showMessBillsByStudentId);

export default showMessBillsByIdRouter;
