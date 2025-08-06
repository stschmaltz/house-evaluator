import { UserObject } from '../../../types/user';
import { GraphQLContext } from '../../../lib/graphql-context';

const userMutationTypeDefs = /* GraphQL */ `
  extend type Mutation {
    userSignIn(input: UserSignInInput!): UserSignInResponse
  }
`;

interface UserSignInInput {
  input: {
    email: string;
    auth0Id: string;
    name?: string;
    picture?: string;
  };
}

const userMutationResolver = {
  Mutation: {
    async userSignIn(
      _: never,
      { input }: UserSignInInput,
      context: GraphQLContext,
    ): Promise<{ user: UserObject }> {
      try {
        if (context.auth0Id !== input.auth0Id) {
          throw new Error('Unauthorized');
        }

        const user = await context.userRepository.handleUserSignIn({
          email: input.email,
          auth0Id: input.auth0Id,
          name: input.name,
          picture: input.picture,
        });

        return { user };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to sign in user');
      }
    },
  },
};

export { userMutationTypeDefs, userMutationResolver };
