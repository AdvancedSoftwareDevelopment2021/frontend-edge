export const success = (data) => ({ code: 0, data, message: null })
export const error = (message) => ({ code: -100, data: null, message })
