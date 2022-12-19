import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Instance/InstancesCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_INSTANCE_MUTATION = gql`
  mutation DeleteInstanceMutation($id: String!) {
    deleteInstance(id: $id) {
      id
    }
  }
`

const InstancesList = ({ instances }) => {
  const [deleteInstance] = useMutation(DELETE_INSTANCE_MUTATION, {
    onCompleted: () => {
      toast.success('Instance deleted')
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
    if (confirm('Are you sure you want to delete instance ' + id + '?')) {
      deleteInstance({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Host</th>
            <th>Secret</th>
            <th>Version</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {instances.map((instance) => (
            <tr key={instance.id}>
              <td>{truncate(instance.host)}</td>
              <td>{truncate(instance.secret)}</td>
              <td>{truncate(instance.version)}</td>
              <td>{timeTag(instance.createdAt)}</td>
              <td>{timeTag(instance.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.instance({ id: instance.id })}
                    title={'Show instance ' + instance.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editInstance({ id: instance.id })}
                    title={'Edit instance ' + instance.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete instance ' + instance.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(instance.id)}
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

export default InstancesList
