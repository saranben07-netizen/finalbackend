import express from 'express';
import { updateShowFlagByMonthYear } from '../../../controllers/admin/mesbill/showmessbilltoall.js';

const showmessbilltoall = express.Router();

showmessbilltoall.post('/showmessbilltoall', updateShowFlagByMonthYear);

export default showmessbilltoall;
