
import express from 'express';
import cors from 'cors';

import { config } from './config';
import { logger } from './services/logger';
import { mediaRouter } from './routes';

export const appMain = () => {

  const app = express();

  // Set up Cross Origin Request Scripting
  app.use(cors());

  // API
  const apiRootName = '/api';
  app.use(`${apiRootName}/media`, mediaRouter);

  // Get PORT from environment
  const { port } = config.env;
  app.listen(port, () => {
    logger.info(`Started server at port ${port}`);
  });
};
