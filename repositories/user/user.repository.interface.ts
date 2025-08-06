import { ObjectId } from 'mongodb';
import { UserObject } from '../../types/user';

export interface UserDocument {
  _id: ObjectId;
  auth0Id: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
}

export interface UserSignInData {
  auth0Id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface UserRepositoryInterface {
  findUser(id: string): Promise<UserObject>;
  findUserByAuth0Id(auth0Id: string): Promise<UserObject | null>;
  handleUserSignIn(userData: UserSignInData): Promise<UserObject>;
  countUsers(): Promise<number>;
  getAllUsers(limit?: number): Promise<UserObject[]>;
}
