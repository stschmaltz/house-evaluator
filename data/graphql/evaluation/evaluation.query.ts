import { GraphQLContext } from '../../../lib/graphql-context';

const evaluationQueryTypeDefs = /* GraphQL */ `
  extend type Query {
    evaluations: [Evaluation!]!
    evaluation(address: String!): Evaluation
  }
`;

const evaluationQueryResolver = {
  Query: {
    evaluations: async (_: unknown, __: unknown, { evaluationRepository }: GraphQLContext) => {
      return evaluationRepository.getEvaluations();
    },
    evaluation: async (
      _: unknown,
      { address }: { address: string },
      { evaluationRepository }: GraphQLContext,
    ) => {
      return evaluationRepository.findEvaluationByAddress(address);
    },
  },
};

export { evaluationQueryTypeDefs, evaluationQueryResolver };
