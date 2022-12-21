import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_INSTANCE_MUTATION = gql`
  mutation DeleteInstanceMutation($id: Int!) {
    deleteInstance(id: $id) {
      id
    }
  }
`

const Instance = ({ instance }) => {
  const [deleteInstance] = useMutation(DELETE_INSTANCE_MUTATION, {
    onCompleted: () => {
      toast.success('Instance deleted')
      navigate(routes.instances())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete instance ' + id + '?')) {
      deleteInstance({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Instance {instance.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Host</th>
              <td>{instance.host}</td>
            </tr>
            <tr>
              <th>Token</th>
              <td>{instance.token}</td>
            </tr>
            <tr>
              <th>Secret</th>
              <td>{instance.secret}</td>
            </tr>
            <tr>
              <th>Version</th>
              <td>{instance.version}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(instance.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(instance.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editInstance({ id: instance.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(instance.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Instance
