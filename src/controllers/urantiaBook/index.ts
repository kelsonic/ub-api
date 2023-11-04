// Node modules.
import express from 'express';
// Relative modules.
import logger from '@utils/logger';

export class UrantiaBookController {
  constructor() {}

  public search(req: express.Request, res: express.Response) {
    logger.info('Hello, world!');
    res.send('Hello, world!');
  }
}

export default UrantiaBookController;
