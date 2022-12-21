export const schema = gql`
  type Instance {
    id: Int!
    token: String!
    host: String!
    secret: String!
    version: String
    createdAt: DateTime!
    updatedAt: DateTime!
    messages: [Message]!
    messagesDelivered: [Message]!
  }

  type Query {
    instances: [Instance!]! @requireAuth
    instance(id: Int!): Instance @requireAuth
  }

  input CreateInstanceInput {
    token: String
    host: String!
    secret: String
    version: String
  }

  input UpdateInstanceInput {
    token: String
    host: String
    secret: String
    version: String
  }

  type Mutation {
    createInstance(input: CreateInstanceInput!): Instance! @requireAuth
    updateInstance(id: Int!, input: UpdateInstanceInput!): Instance!
      @requireAuth
    deleteInstance(id: Int!): Instance! @requireAuth
  }
`
