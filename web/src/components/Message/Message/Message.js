import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

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



const Message = ({ message }) => {
  const [deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION, {
    onCompleted: () => {
      toast.success('Message deleted')
      navigate(routes.messages())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    onCompleted: () => {
      toast.success('Message sent')
    },
    onError: (error) => {
      toast.error(error.message)
    },
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
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Message {message.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{message.id}</td>
            </tr>
            <tr>
              <th>Entity</th>
              <td>{message.entity}</td>
            </tr>
            <tr>
              <th>Operation</th>
              <td>{message.operation}</td>
            </tr>
            <tr>
              <th>Payload</th>
              <td><pre>{JSON.stringify(JSON.parse(message.payload), null, 2)}</pre></td>
            </tr>
            <tr>
              <th>From instance</th>
              <td>{message.from.host} ({message.from.id})</td>
            </tr>
            <tr>
              <th>Delivered to</th>
              <td>{message.deliveredTo.map(instance => `${instance.host} (${instance.id})`).join(",")}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(message.createdAt)}</td>
            </tr>
            <tr>
              <th>Delivered at (updated)</th>
              <td>{timeTag(message.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editMessage({ id: message.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          title={'Send message ' + message.id}
          className="rw-button rw-button-blue"
          onClick={() => onSendClick(message.id)}
        >
          Send
        </button>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(message.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Message
