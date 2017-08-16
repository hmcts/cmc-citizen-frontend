import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

const baseServiceURL: string = `${config.get('pay.url')}/users`

const payment = {
  id: '12',
  amount: 100,
  state: {
    status: 'failed'
  },
  _links: {
    next_url: {
      method: 'get',
      href: '/claim-confirmed'
    }
  }
}

export function resolveCreate () {
  mock(baseServiceURL)
    .post(new RegExp('/[0-9]+/payment'))
    .reply(HttpStatus.CREATED, { ...payment, state: { status: 'created' } })
}

export function rejectCreate () {
  mock(baseServiceURL)
    .post(new RegExp('/[0-9]+/payments'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}

export function resolveRetrieve (status: string) {
  mock(baseServiceURL)
    .get(new RegExp('/[0-9]+/payments/[0-9]+'))
    .reply(HttpStatus.OK, { ...payment, state: { status: status } })
}

export function rejectRetrieve () {
  mock(baseServiceURL)
    .get(new RegExp('/[0-9]+/payments/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}
