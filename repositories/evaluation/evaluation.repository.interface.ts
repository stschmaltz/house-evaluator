import { ObjectId } from 'mongodb';
import { EvaluationObject, RouteObject } from '../../types/evaluation';

export interface EvaluationDocument {
  _id: ObjectId;
  address: string;
  routes: RouteObject[];
  createdAt: Date;
}

export interface EvaluationRepositoryInterface {
  saveEvaluation(address: string, routes: RouteObject[]): Promise<EvaluationObject>;
  getEvaluations(limit?: number): Promise<EvaluationObject[]>;
  findEvaluationByAddress(address: string): Promise<EvaluationObject | null>;
}
