import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserRepository } from '../repositories/user/user.repository';
import { UserRepositoryInterface } from '../repositories/user/user.repository.interface';

const appContainer = new Container();

// Example binding
appContainer
  .bind<string>(TYPES.ExampleService)
  .toConstantValue('Example Service');

// UserRepository binding
appContainer
  .bind<UserRepositoryInterface>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();

export { appContainer };
