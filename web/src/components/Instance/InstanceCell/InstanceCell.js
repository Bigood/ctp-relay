import Instance from 'src/components/Instance/Instance'

export const QUERY = gql`
  query FindInstanceById($id: Int!) {
    instance: instance(id: $id) {
      id
      host
      token
      secret
      version
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Instance not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ instance }) => {
  return <Instance instance={instance} />
}
