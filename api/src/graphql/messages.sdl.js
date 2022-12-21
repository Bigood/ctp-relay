export const schema = gql`
  type Message {
    id: Int!
    payload: JSON!
    from: Instance!
    instanceId: String!
    deliveredTo: [Instance]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    messages: [Message!]! @requireAuth
    message(id: Int!): Message @requireAuth
  }

  input CreateMessageInput {
    payload: JSON!
    instanceId: String!
  }

  input UpdateMessageInput {
    payload: JSON
    instanceId: String
  }

  type Mutation {
    createMessage(input: CreateMessageInput!): Message! @requireInstanceAuth
    createMessageFromClient(payload: String!): Message! @requireAuth
    updateMessage(id: Int!, input: UpdateMessageInput!): Message! @requireAuth
    deleteMessage(id: Int!): Message! @requireAuth
  }
`
