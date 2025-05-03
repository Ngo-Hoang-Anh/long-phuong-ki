import { loginController, registerController } from 'controllers/AuthController';
import { Router } from 'express';
import { loginValidation, registerValidation } from 'middlewares/validation/Auth';
const authRouter: Router = Router();



authRouter.post('/login', loginValidation, loginController);
authRouter.post('/register', registerValidation, registerController);

export default authRouter