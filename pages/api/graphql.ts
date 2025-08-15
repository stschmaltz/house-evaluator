import { createYoga } from 'graphql-yoga';
import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { schema } from '../../data/graphql';
import { appContainer } from '../../container/inversify.config';
import { TYPES } from '../../container/types';
import { ContextBuilder } from '../../lib/graphql-context';
import { UserRepositoryInterface } from '../../repositories/user/user.repository.interface';
import { EvaluationRepositoryInterface } from '../../repositories/evaluation/evaluation.repository.interface';

const userRepository = appContainer.get<UserRepositoryInterface>(
  TYPES.UserRepository,
);
const evaluationRepository = appContainer.get<EvaluationRepositoryInterface>(
  TYPES.EvaluationRepository,
);
const contextBuilder = new ContextBuilder(
  userRepository,
  evaluationRepository,
);

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  graphqlEndpoint: '/api/graphql',
  maskedErrors: true,
  context: async ({ req, res }) => {
    const session = await getSession(req, res);

    return contextBuilder.buildContext(session);
  },
});
