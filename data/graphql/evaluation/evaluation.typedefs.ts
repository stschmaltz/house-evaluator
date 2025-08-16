const evaluationTypeDefs = /* GraphQL */ `
  type Route {
    destination: String!
    duration: String!
    distance: String!
    travelMode: String!
    polyline: String
    transitDetails: String
  }

  type Evaluation {
    _id: String!
    address: String!
    routes: [Route!]!
    createdAt: String
  }
`;

export { evaluationTypeDefs };
