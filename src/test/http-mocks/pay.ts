import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

const payUrl = config.get<string>('pay.url')
const payPath = config.get<string>('pay.path')

// const payment = {
//   id: '12',
//   amount: 100,
//   state: {
//     status: 'failed'
//   },
//   _links: {
//     next_url: {
//       method: 'get',
//       href: '/claim-confirmed'
//     }
//   }
// }
const payment: object =
  {
    reference: 'RC-1520-2670-0178-8285',
    amount: 35,
    links: {
      self: {
        href: 'http://localhost:4421/card-payments/RC-1520-2670-0178-8285',
        method: 'GET'
      }
    }
  }

const requestBody: object = {
  amount: 50,
  case_reference: new RegExp(/^[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}$/i),
  description: 'Money Claim issue fee',
  service: 'CMC',
  currency: 'GBP',
  site_id: 'AA00',
  fee: [{ 'calculated_amount': 50, 'code': 'X0002', 'version': 1 }],
  ccd_case_number: 'UNKNOWN'
}


export function resolveCreate () {
  mock(payUrl)
    .post(payPath, requestBody)
    .reply(HttpStatus.CREATED, { ...payment, state: 'Initiated' })
}

export function rejectCreate () {
  mock(payUrl)
    .post(payPath, requestBody)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}

export function resolveRetrieve (status: string) {
  mock(payUrl)
    .get(`${payPath}/` + new RegExp(`[\\d]+`))
    .reply(HttpStatus.OK, { ...payment, state: `${status}` })
}

export function rejectRetrieve () {
  mock(payUrl)
    .get(`${payPath}/` + new RegExp(`[\\d]+`))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}
