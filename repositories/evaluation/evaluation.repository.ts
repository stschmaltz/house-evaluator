import { injectable } from 'inversify';
import { getDbClient } from '../../data/database/mongodb';
import { EvaluationObject, RouteObject } from '../../types/evaluation';
import {
  EvaluationDocument,
  EvaluationRepositoryInterface,
} from './evaluation.repository.interface';

const collectionName = 'evaluations';

const mapDocToObj = (doc: EvaluationDocument): EvaluationObject => ({
  _id: doc._id.toHexString(),
  address: doc.address,
  routes: doc.routes,
  createdAt: doc.createdAt,
});

@injectable()
export class EvaluationRepository implements EvaluationRepositoryInterface {
  public async saveEvaluation(
    address: string,
    routes: RouteObject[],
  ): Promise<EvaluationObject> {
    const { db } = await getDbClient();

    const result = await db.collection<EvaluationDocument>(collectionName).findOneAndUpdate(
      { address },
      { $set: { address, routes, createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' },
    );

    if (!result) {
      throw new Error('Failed to save evaluation');
    }

    return mapDocToObj(result);
  }

  public async getEvaluations(limit = 100): Promise<EvaluationObject[]> {
    const { db } = await getDbClient();
    const docs = await db
      .collection<EvaluationDocument>(collectionName)
      .find({})
      .limit(limit)
      .toArray();
    return docs.map(mapDocToObj);
  }

  public async findEvaluationByAddress(
    address: string,
  ): Promise<EvaluationObject | null> {
    const { db } = await getDbClient();
    const doc = await db
      .collection<EvaluationDocument>(collectionName)
      .findOne({ address });
    return doc ? mapDocToObj(doc) : null;
  }
}
