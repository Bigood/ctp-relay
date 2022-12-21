import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import InstanceForm from 'src/components/Instance/InstanceForm'

export const QUERY = gql`
  query EditInstanceById($id: Int!) {
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
const UPDATE_INSTANCE_MUTATION = gql`
  mutation UpdateInstanceMutation($id: Int!, $input: UpdateInstanceInput!) {
    updateInstance(id: $id, input: $input) {
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

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ instance }) => {
  const [updateInstance, { loading, error }] = useMutation(
    UPDATE_INSTANCE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Instance updated')
        navigate(routes.instances())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateInstance({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Instance {instance?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <InstanceForm
          instance={instance}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
