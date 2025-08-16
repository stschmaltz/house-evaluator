import { makeExecutableSchema } from '@graphql-tools/schema';
import { userTypeDefs } from './user/user.typedefs';
import { userQueryTypeDefs, userQueryResolver } from './user/user.query';
import {
  userMutationTypeDefs,
  userMutationResolver,
} from './user/user.mutation';
import { evaluationTypeDefs } from './evaluation/evaluation.typedefs';
import {
  evaluationQueryTypeDefs,
  evaluationQueryResolver,
} from './evaluation/evaluation.query';

const baseSchema = /* GraphQL */ `
  type Query
  type Mutation
`;

const typeDefs = [
  baseSchema,
  userTypeDefs,
  userQueryTypeDefs,
  userMutationTypeDefs,
  evaluationTypeDefs,
  evaluationQueryTypeDefs,
];

const resolvers = [userQueryResolver, userMutationResolver, evaluationQueryResolver];

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { schema };
