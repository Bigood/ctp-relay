import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Message/MessagesCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_MESSAGE_MUTATION = gql`
  mutation DeleteMessageMutation($id: Int!) {
    deleteMessage(id: $id) {
      id
    }
  }
`

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessageMutation($id: Int!) {
    sendMessage(id: $id) {
      id
    }
  }
`

const MessagesList = ({ messages }) => {
  const [deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION, {
    onCompleted: () => {
      toast.success('Message deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    onCompleted: () => {
      toast.success('Message sent')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete message ' + id + '?')) {
      deleteMessage({ variables: { id } })
    }
  }

  const onSendClick = (id) => {
    if (confirm('Are you sure you want to send the message to all undelivered instances ' + id + '?')) {
      sendMessage({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Entity</th>
            <th>Operation</th>
            <th>Payload</th>
            <th>Instance id</th>
            <th>Created at</th>
            <th>Delivered to</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{truncate(message.id)}</td>
              <td>{truncate(message.entity)}</td>
              <td>{truncate(message.operation)}</td>
              <td><pre>{truncate(JSON.stringify(JSON.parse(message.payload),null, 2))}</pre></td>
              <td>{message.from.host} ({message.from.id})</td>
              <td>{message.deliveredTo.map(instance => `${instance.host} (${instance.id})`).join(",")}</td>
              <td>{timeTag(message.createdAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.message({ id: message.id })}
                    title={'Show message ' + message.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editMessage({ id: message.id })}
                    title={'Edit message ' + message.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Send message ' + message.id}
                    className="rw-button rw-button-small rw-button-blue"
                    onClick={() => onSendClick(message.id)}
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    title={'Delete message ' + message.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(message.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MessagesList
