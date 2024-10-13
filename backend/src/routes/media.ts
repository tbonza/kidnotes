import express, {Request, Response} from 'express';
import { logger } from '../services/logger';

const mediaRouter = express.Router();

/**
 * POST /store
 * Store an image
 */
mediaRouter.post('/store', async (req: Request, res: Response) => {
  const receipt = {
    message: `have a great day!`,
  }

  logger.info('message received');

  res.status(200).json(receipt);
});

export default mediaRouter;
