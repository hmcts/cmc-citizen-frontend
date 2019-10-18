import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

const baseURL = config.get<string>('pay.url')
const endpointPath = '/card-payments'
const paymentsPath = '/payments'

export const paymentInitiateResponse: object = {
  reference: 'RC-1520-4225-4161-2265',
  date_created: '2018-03-07T11:35:42.095+0000',
  status: 'Initiated',
  _links: {
    next_url: {
      href: 'https://www.payments.service.gov.uk/secure/8b647ade-02cc-4c85-938d-4db560404df8',
      method: 'GET'
    }
  }
}

const paymentRetrieveResponse: object = {
  amount: 60,
  description: 'Money Claim issue fee',
  reference: 'RC-1520-4276-0065-8715',
  currency: 'GBP',
  ccd_case_number: 'UNKNOWN',
  case_reference: 'dfd75bac-6d54-4c7e-98f7-50e047d7c7f5',
  channel: 'online',
  method: 'card',
  external_provider: 'gov pay',
  status: 'Success',
  external_reference: 'h8mtngl42o4i8ajrq64mdqufhl',
  site_id: 'AA00',
  service_name: 'Civil Money Claims',
  fees: [
    {
      code: 'X0026',
      version: '1',
      calculated_amount: 60
    }],
  _links: {
    self: {
      href: 'http://localhost:4421/card-payments/RC-1520-4276-0065-8715',
      method: 'GET'
    }
  }
}

export function resolveCreate () {
  mock(baseURL)
    .post(endpointPath)
    .reply(HttpStatus.CREATED, paymentInitiateResponse)
}

export function rejectCreate () {
  mock(baseURL)
    .post(endpointPath)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}

export function resolveRetrieve (status: string) {
  mock(baseURL + endpointPath)
    .get(new RegExp(`\/[\\d]+`))
    .reply(HttpStatus.OK, { ...paymentRetrieveResponse, status: `${status}` })
}

export function resolveUpdate (paymentReference: string = 'RC-1520-4276-0065-8715'): mock.Scope {
  return mock(baseURL + paymentsPath)
    .patch(`/${paymentReference}`)
    .reply(HttpStatus.OK)
}

export function resolveRetrieveToNotFound () {
  mock(baseURL + endpointPath)
    .get(new RegExp(`\/[\\d]+`))
    .reply(HttpStatus.NOT_FOUND)
}

export function rejectRetrieve () {
  mock(baseURL + endpointPath)
    .get(new RegExp(`\/[\\d]+`))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}
