import { mockRedwoodDirective, getDirectiveName } from '@redwoodjs/testing/api'

import requireInstanceAuth from './requireInstanceAuth'

describe('requireInstanceAuth directive', () => {
  it('declares the directive sdl as schema, with the correct name', () => {
    expect(requireInstanceAuth.schema).toBeTruthy()
    expect(getDirectiveName(requireInstanceAuth.schema)).toBe(
      'requireInstanceAuth'
    )
  })

  it('has a requireInstanceAuth throws an error if validation does not pass', () => {
    const mockExecution = mockRedwoodDirective(requireInstanceAuth, {})

    expect(mockExecution).toThrowError(
      'Implementation missing for requireInstanceAuth'
    )
  })
})
