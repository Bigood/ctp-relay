import {
  messages,
  message,
  createMessage,
  updateMessage,
  deleteMessage,
} from './messages'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('messages', () => {
  scenario('returns all messages', async (scenario) => {
    const result = await messages()

    expect(result.length).toEqual(Object.keys(scenario.message).length)
  })

  scenario('returns a single message', async (scenario) => {
    const result = await message({ id: scenario.message.one.id })

    expect(result).toEqual(scenario.message.one)
  })

  scenario('creates a message', async (scenario) => {
    const result = await createMessage({
      input: {
        payload: { foo: 'bar' },
        instanceId: scenario.message.two.instanceId,
        updatedAt: '2022-12-19T10:51:31.538Z',
      },
    })

    expect(result.payload).toEqual({ foo: 'bar' })
    expect(result.instanceId).toEqual(scenario.message.two.instanceId)
    expect(result.updatedAt).toEqual(new Date('2022-12-19T10:51:31.538Z'))
  })

  scenario('updates a message', async (scenario) => {
    const original = await message({ id: scenario.message.one.id })
    const result = await updateMessage({
      id: original.id,
      input: { payload: { foo: 'baz' } },
    })

    expect(result.payload).toEqual({ foo: 'baz' })
  })

  scenario('deletes a message', async (scenario) => {
    const original = await deleteMessage({
      id: scenario.message.one.id,
    })
    const result = await message({ id: original.id })

    expect(result).toEqual(null)
  })
})
