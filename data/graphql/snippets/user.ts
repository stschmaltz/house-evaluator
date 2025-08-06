export const signInUserMutation = /* GraphQL */ `
  mutation userSignIn($input: UserSignInInput!) {
    userSignIn(input: $input) {
      user {
        _id
        name
        email
        auth0Id
        picture
        emailVerified
      }
    }
  }
`;

export const getCurrentUserQuery = /* GraphQL */ `
  query getCurrentUser {
    me {
      _id
      name
      email
      auth0Id
      picture
      emailVerified
    }
  }
`;
