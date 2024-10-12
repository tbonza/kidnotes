
import express from 'express';
import cors from 'cors';

import { logger } from './services/logger';
import { imagesRouter, videoRouter } from './routes';

export const appMain() = () => {

  const app = express();

  // Set up Cross Origin Request Scripting
  app.use(cors());

  // API
  const rootName = '/api';
  app.use(`${routeName}/images`, imagesRouter);
  app.use(`${routeName}/video`, videoRouter);

  // Get PORT from environment
  const { port } = config.env;
  app.listen(port, ()) => {
    logger.info(`Started server at port ${port}`);
  });
}
