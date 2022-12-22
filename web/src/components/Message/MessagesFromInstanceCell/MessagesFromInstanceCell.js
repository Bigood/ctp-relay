import Messages from 'src/components/Message/Messages'

export const QUERY = gql`
  query FindMessagesFromInstance($id: Int!) {
    messagesFromInstance(id: $id) {
      id
      entity
      payload
      operation
      instanceId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No messages yet. '}
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ messagesFromInstance }) => {
  return <Messages messages={messagesFromInstance} />
}
