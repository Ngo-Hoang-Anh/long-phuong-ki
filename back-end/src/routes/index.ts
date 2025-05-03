import { Router, Request, Response, NextFunction } from 'express';
import authRouter from './AuthRouter';
import userRouter from './UserRouter';
import { validateAccessToken } from 'middlewares/validate_token';
import roomRouter from './RoomRouter';
const apiRouter: Router = Router();

apiRouter.use('/heathz', (req, res) => res.status(200).json("success"))
apiRouter.use(authRouter)
apiRouter.use(validateAccessToken);
apiRouter.use('/user', userRouter)
apiRouter.use('/room', roomRouter)

export default apiRouter