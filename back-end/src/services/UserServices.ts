import mongooes, { Model } from 'mongoose';
import UserModel, { IUser } from '../models/User';
import { IUserInfo } from 'interfaces/UserInfo';

export class UserService {
    constructor() {
    }

    async createUser(name: string, email: string, password: string): Promise<IUser> {
        let newUser = new UserModel({ name, email: email.toLowerCase(), password });
        return newUser.save();
    }
    async updateUserOnline(userId: string, isOnline: boolean) {
        return UserModel.findOneAndUpdate({ _id: userId }, { isOnline }, { new: true }).select('name email isOnline createdAt updatedAt');
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email: email.toLowerCase() });
    }
    async getUserById(_id: string): Promise<IUserInfo | null> {
        return UserModel.findById(_id, 'name email isOnline createdAt updatedAt isAdmin');
    }
    async getUserOnline(): Promise<IUserInfo[]> {
        return await UserModel.find({ isOnline: true }, 'name email isOnline createdAt updatedAt');
    }
}