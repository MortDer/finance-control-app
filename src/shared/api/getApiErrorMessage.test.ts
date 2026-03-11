import { getApiErrorMessage } from './getApiErrorMessage'

describe('getApiErrorMessage', () => {
  it('returns fallback for non-axios errors', () => {
    const result = getApiErrorMessage(new Error('boom'), 'fallback message')

    expect(result).toBe('fallback message')
  })

  it('returns first server error message for axios-like errors', () => {
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          errors: [{ message: 'Server validation failed' }],
        },
      },
    }

    const result = getApiErrorMessage(axiosLikeError, 'fallback message')

    expect(result).toBe('Server validation failed')
  })

  it('returns fallback when axios-like error has no message', () => {
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          errors: [{}],
        },
      },
    }

    const result = getApiErrorMessage(axiosLikeError, 'fallback message')

    expect(result).toBe('fallback message')
  })
})
