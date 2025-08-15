import { makeExecutableSchema } from '@graphql-tools/schema';
import { userTypeDefs } from './user/user.typedefs';
import { userQueryTypeDefs, userQueryResolver } from './user/user.query';
import {
  userMutationTypeDefs,
  userMutationResolver,
} from './user/user.mutation';

const baseSchema = /* GraphQL */ `
  type Query
  type Mutation
`;

const typeDefs = [
  baseSchema,
  userTypeDefs,
  userQueryTypeDefs,
  userMutationTypeDefs,
];

const resolvers = [userQueryResolver, userMutationResolver];

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { schema };
