import { Link, routes } from '@redwoodjs/router'

import Instances from 'src/components/Instance/Instances'

export const QUERY = gql`
  query FindInstances {
    instances {
      host
      secret
      version
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No instances yet. '}
      <Link to={routes.newInstance()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ instances }) => {
  return <Instances instances={instances} />
}
