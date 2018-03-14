import * as _request from 'request-promise-native'
import { RequestAPI } from 'client/request'

const request: RequestAPI = _request.defaults({ json: true })

export {
  request
}
