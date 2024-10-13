import express, {Request, Response} from 'express';

const mediaRouter = express.Router();

/**
 * POST /store
 * Store an image
 */
mediaRouter.post('/store', async (req: Request, res: Response) => {
  const receipt = {
    message: `have a great day!`,
  }

  res.status(200).json(receipt);
});

export default mediaRouter;
