// Node modules.
import express from 'express';
import urantiaBookRouter from './urantia-book';

const router = express.Router();

router.use('/urantia-book', urantiaBookRouter);

export default router;
