import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import InstanceForm from 'src/components/Instance/InstanceForm'

const CREATE_INSTANCE_MUTATION = gql`
  mutation CreateInstanceMutation($input: CreateInstanceInput!) {
    createInstance(input: $input) {
      id
    }
  }
`

const NewInstance = () => {
  const [createInstance, { loading, error }] = useMutation(
    CREATE_INSTANCE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Instance created')
        navigate(routes.instances())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createInstance({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Instance</h2>
      </header>
      <div className="rw-segment-main">
        <InstanceForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewInstance
