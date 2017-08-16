import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = `${config.get('fees.url')}/fees-register`

const issueFeeCode: string = config.get<string>('fees.issueFeeCode')
const hearingFeeCode: string = config.get<string>('fees.hearingFeeCode')

const body = {
  amount: 100
}

export function resolveCalculateIssueFee () {
  resolveCallFeesRegister(issueFeeCode)
}

export function rejectCalculateIssueFee (reason: string = 'HTTP error') {
  rejectCallFeesRegister(issueFeeCode, reason)
}

export function resolveCalculateHearingFee () {
  resolveCallFeesRegister(hearingFeeCode)
}

export function rejectCalculateHearingFee (reason: string = 'HTTP error') {
  rejectCallFeesRegister(hearingFeeCode, reason)
}

export function resolveCallFeesRegister (feeCode: string) {
  mock(serviceBaseURL)
    .get(new RegExp(`/categories/${feeCode}/ranges/[0-9]+/fees`))
    .reply(HttpStatus.OK, body)
}

export function rejectCallFeesRegister (feeCode: string, reason: string = 'HTTP error') {
  mock(serviceBaseURL)
    .get(new RegExp(`/categories/${feeCode}/ranges/[0-9]+/fees`))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
