
import { getHistoryUserController, getUserController, getUserOnlineController } from 'controllers/UserController';
import { Router } from 'express';
const userRouter: Router = Router();



userRouter.get('/info', getUserController);
userRouter.get('/history/:id', getHistoryUserController);
userRouter.get('/getOnline', getUserOnlineController);

export default userRouter