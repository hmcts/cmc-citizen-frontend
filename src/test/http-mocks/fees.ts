import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import { Scope } from 'nock'

const serviceBaseURL: string = `${config.get('fees.url')}/range-groups`

const issueFeeCode: string = config.get<string>('fees.issueFee.code')
const hearingFeeCode: string = config.get<string>('fees.hearingFee.code')

const calculationOutcome = {
  amount: 2500,
  fee: {
    code: 'X0048',
    description: 'Civil Court fees - Hearing fees - Claim Amount - 0.01 up to 300 GBP',
    amount: 2500,
    type: 'fixed'
  }
}

const rangeGroup = {
  id: 1,
  description: 'CMC - Hearing',
  ranges: [{
    fee: {
      code: 'X0048',
      description: 'Civil Court fees - Hearing fees - Claim Amount - 0.01 up to 300 GBP',
      amount: 2500,
      type: 'fixed'
    },
    from: 1,
    to: 3000
  }]

}

export function resolveCalculateIssueFee (): Scope {
  return resolveCalculateFee(issueFeeCode)
}

export function rejectCalculateIssueFee (reason: string = 'HTTP error'): Scope {
  return rejectCalculateFee(issueFeeCode, reason)
}

export function resolveCalculateHearingFee (): Scope {
  return resolveCalculateFee(hearingFeeCode)
}

export function rejectCalculateHearingFee (reason: string = 'HTTP error'): Scope {
  return rejectCalculateFee(hearingFeeCode, reason)
}

export function resolveGetIssueFeeRangeGroup (): Scope {
  return resolveGetFeeRangeGroup(issueFeeCode)
}

export function rejectGetIssueFeeRangeGroup (reason: string = 'HTTP error'): Scope {
  return rejectGetFeeRangeGroup(issueFeeCode, reason)
}

export function resolveGetHearingFeeRangeGroup (): Scope {
  return resolveGetFeeRangeGroup(hearingFeeCode)
}

export function rejectGetHearingFeeRangeGroup (reason: string = 'HTTP error'): Scope {
  return rejectGetFeeRangeGroup(hearingFeeCode, reason)
}

export function resolveCalculateFee (code: string): Scope {
  return mock(serviceBaseURL)
    .get(new RegExp(`/${code}/calculations\\?value=[0-9]+`))
    .reply(HttpStatus.OK, calculationOutcome)
}

export function rejectCalculateFee (code: string, reason: string = 'HTTP error'): Scope {
  return mock(serviceBaseURL)
    .get(new RegExp(`/${code}/calculations\\?value=[0-9]+`))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

function resolveGetFeeRangeGroup (code: string): Scope {
  return mock(serviceBaseURL)
    .get(`/${code}`)
    .reply(HttpStatus.OK, rangeGroup)
}

function rejectGetFeeRangeGroup (code: string, reason: string = 'HTTP error'): Scope {
  return mock(serviceBaseURL)
    .get(`/${code}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
