export const schema = gql`
  type Instance {
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
    instance(id: String!): Instance @requireAuth
  }

  input CreateInstanceInput {
    host: String!
    secret: String!
    version: String
  }

  input UpdateInstanceInput {
    host: String
    secret: String
    version: String
  }

  type Mutation {
    createInstance(input: CreateInstanceInput!): Instance! @requireAuth
    updateInstance(id: String!, input: UpdateInstanceInput!): Instance!
      @requireAuth
    deleteInstance(id: String!): Instance! @requireAuth
  }
`
