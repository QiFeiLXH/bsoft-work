const responseBody = {
  message: '',
  timestamp: 0,
  body: null,
  properties: null,
  code: 200
}

export const builder = (data, properties, message, code = 200, headers = {}) => {
  responseBody.body = data
  responseBody.properties = properties
  if (message !== undefined && message !== null) {
    responseBody.message = message
  }
  if (code !== undefined && code !== 200) {
    responseBody.code = code
    responseBody._status = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  responseBody.timestamp = new Date().getTime()
  return responseBody
}

export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}
