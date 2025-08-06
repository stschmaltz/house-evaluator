import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { getDbClient } from '../../data/database/mongodb';
import { UserObject } from '../../types/user';
import { logger } from '../../lib/logger';
import {
  UserDocument,
  UserRepositoryInterface,
  UserSignInData,
} from './user.repository.interface';

const collectionName = 'users';

const mapUserDocumentToUserObject = (doc: UserDocument): UserObject => ({
  _id: doc._id.toHexString(),
  auth0Id: doc.auth0Id,
  email: doc.email,
  name: doc.name,
  picture: doc.picture,
  emailVerified: doc.emailVerified ?? false,
});

@injectable()
export class UserRepository implements UserRepositoryInterface {
  public async findUser(id: string): Promise<UserObject> {
    const { db } = await getDbClient();

    const user = await db
      .collection<UserDocument>(collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new Error('User not found');
    }

    return mapUserDocumentToUserObject(user);
  }

  public async findUserByAuth0Id(auth0Id: string): Promise<UserObject | null> {
    const { db } = await getDbClient();

    const user = await db
      .collection<UserDocument>(collectionName)
      .findOne({ auth0Id });

    if (!user) {
      return null;
    }

    return mapUserDocumentToUserObject(user);
  }

  public async handleUserSignIn(userData: UserSignInData): Promise<UserObject> {
    logger.info('handleUserSignIn', userData);

    const { db } = await getDbClient();

    const user = await db
      .collection<UserDocument>(collectionName)
      .findOneAndUpdate(
        { auth0Id: userData.auth0Id },
        {
          $set: {
            auth0Id: userData.auth0Id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            emailVerified: false,
          },
        },
        { upsert: true, returnDocument: 'after' },
      );

    if (!user) {
      throw new Error('User not found');
    }

    return mapUserDocumentToUserObject(user);
  }

  public async countUsers(): Promise<number> {
    const { db } = await getDbClient();
    return db.collection<UserDocument>(collectionName).countDocuments();
  }

  public async getAllUsers(limit = 100): Promise<UserObject[]> {
    const { db } = await getDbClient();
    const users = await db
      .collection<UserDocument>(collectionName)
      .find({})
      .limit(limit)
      .toArray();
    return users.map(mapUserDocumentToUserObject);
  }
}
