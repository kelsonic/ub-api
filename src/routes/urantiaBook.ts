// Node modules.
import express from 'express';
// Relative modules.
import UrantiaBookController from '@controllers/urantiaBook';

const router = express.Router();
const controller = new UrantiaBookController();

router.get('/', controller.search);

export default router;
