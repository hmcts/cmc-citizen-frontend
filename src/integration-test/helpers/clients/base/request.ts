import { request as baseRequest } from 'client/request'

export const request = baseRequest.defaults({ json: true })
