import { IUser } from 'models/User';
import { UserService } from './UserServices';
import bcrypt from 'bcrypt';
import { getToken } from 'common/auth/authentication';
import { IUserInfo } from 'interfaces/UserInfo';

interface IResponseLogin {
    user: IUserInfo,
    accessToken: string
}

export class AuthService {
    private userService: UserService;
    private saltRounds = 10;
    constructor() {
        this.userService = new UserService();
    }

    async registerUser(name: string, email: string, password: string): Promise<IUser> {
        let descryptPass = bcrypt.hashSync(password, this.saltRounds);
        return this.userService.createUser(name, email, descryptPass);
    }

    async loginUser(email: string, password: string): Promise<IResponseLogin | null> {
        const user = await this.userService.getUserByEmail(email);
        if (user) {
            let descryptPass = bcrypt.compareSync(password, user?.password);
            if (!descryptPass) {
                return null;
            }
            const accessToken = getToken({ _id: user._id, name: user.name });
            return {
                accessToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            }
        }
        return null;
    }
}