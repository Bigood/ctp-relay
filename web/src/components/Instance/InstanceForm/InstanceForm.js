import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

const InstanceForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.instance?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="secret"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Secret
        </Label>

        <TextField
          name="secret"
          defaultValue={props.instance?.secret}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="secret" className="rw-field-error" />

        <Label
          name="version"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Version
        </Label>

        <TextField
          name="version"
          defaultValue={props.instance?.version}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="version" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default InstanceForm
