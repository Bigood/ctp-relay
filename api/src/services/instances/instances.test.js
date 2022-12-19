import {
  instances,
  instance,
  createInstance,
  updateInstance,
  deleteInstance,
} from './instances'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('instances', () => {
  scenario('returns all instances', async (scenario) => {
    const result = await instances()

    expect(result.length).toEqual(Object.keys(scenario.instance).length)
  })

  scenario('returns a single instance', async (scenario) => {
    const result = await instance({ id: scenario.instance.one.id })

    expect(result).toEqual(scenario.instance.one)
  })

  scenario('creates a instance', async () => {
    const result = await createInstance({
      input: {
        host: 'String',
        secret: 'String',
        updatedAt: '2022-12-19T10:51:12.411Z',
      },
    })

    expect(result.host).toEqual('String')
    expect(result.secret).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2022-12-19T10:51:12.411Z'))
  })

  scenario('updates a instance', async (scenario) => {
    const original = await instance({
      id: scenario.instance.one.id,
    })
    const result = await updateInstance({
      id: original.id,
      input: { host: 'String2' },
    })

    expect(result.host).toEqual('String2')
  })

  scenario('deletes a instance', async (scenario) => {
    const original = await deleteInstance({
      id: scenario.instance.one.id,
    })
    const result = await instance({ id: original.id })

    expect(result).toEqual(null)
  })
})
