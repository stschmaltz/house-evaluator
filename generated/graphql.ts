export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Mutation = {
  __typename?: 'Mutation';
  userSignIn: Maybe<UserSignInResponse>;
};

export type MutationUserSignInArgs = {
  input: UserSignInInput;
};

export type Query = {
  __typename?: 'Query';
  me: User;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String']['output'];
  auth0Id: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailVerified: Maybe<Scalars['Boolean']['output']>;
  name: Maybe<Scalars['String']['output']>;
  picture: Maybe<Scalars['String']['output']>;
};

export type UserSignInInput = {
  auth0Id: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  picture: InputMaybe<Scalars['String']['input']>;
};

export type UserSignInResponse = {
  __typename?: 'UserSignInResponse';
  user: User;
};

export type UserSignInMutationVariables = Exact<{
  input: UserSignInInput;
}>;

export type UserSignInMutation = {
  __typename?: 'Mutation';
  userSignIn: {
    __typename?: 'UserSignInResponse';
    user: {
      __typename?: 'User';
      _id: string;
      name: string | null;
      email: string;
      auth0Id: string;
      picture: string | null;
      emailVerified: boolean | null;
    };
  } | null;
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = {
  __typename?: 'Query';
  me: {
    __typename?: 'User';
    _id: string;
    name: string | null;
    email: string;
    auth0Id: string;
    picture: string | null;
    emailVerified: boolean | null;
  };
};
