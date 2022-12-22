export const schema = gql`
  type Message {
    id: Int!
    entity: String!
    payload: String!
    operation: String!
    from: Instance!
    instanceId: String!
    deliveredTo: [Instance]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    messages: [Message!]! @requireAuth
    messagesFromInstance(id:Int!): [Message!]! @requireAuth
    message(id: Int!): Message @requireAuth
  }

  input CreateMessageInput {
    entity: String!
    payload: String!
    operation: String!
    instanceId: String!
  }

  input UpdateMessageInput {
    entity: String
    payload: String
    operation: String
    instanceId: String
  }

  type Mutation {
    createMessage(input: CreateMessageInput!): Message! @requireInstanceAuth
    createMessageFromClient(operation: String!, entity: String!, payload: String!): Message! @requireAuth
    updateMessage(id: Int!, input: UpdateMessageInput!): Message! @requireAuth
    deleteMessage(id: Int!): Message! @requireAuth
    sendMessage(id: Int!): Message @requireAuth
  }
`
