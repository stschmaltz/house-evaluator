import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserRepository } from '../repositories/user/user.repository';
import { UserRepositoryInterface } from '../repositories/user/user.repository.interface';

const appContainer = new Container();

// House Evaluator binding
appContainer
  .bind<string>(TYPES.ExampleService)
  .toConstantValue('House Evaluator Service');

// UserRepository binding
appContainer
  .bind<UserRepositoryInterface>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();

export { appContainer };
