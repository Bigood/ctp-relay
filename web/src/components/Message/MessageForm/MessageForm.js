import {
  Form,
  FormError,
  FieldError,
  Label,
  TextAreaField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

const MessageForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.message?.id)
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
          name="payload"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Payload
        </Label>

        <TextAreaField
          name="payload"
          defaultValue={JSON.stringify(props.message?.payload)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true, required: true }}
        />

        <FieldError name="payload" className="rw-field-error" />

        <Label
          name="instanceId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Instance id
        </Label>

        <TextField
          name="instanceId"
          defaultValue={props.message?.instanceId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="instanceId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default MessageForm
