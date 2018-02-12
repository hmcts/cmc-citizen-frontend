import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const service: string = (config.get<string>('fees.service'))
const jurisdiction1: string = config.get<string>('fees.jurisdiction1')
const jurisdiction2: string = config.get<string>('fees.jurisdiction2')
const onlineChannel: string = config.get<string>('fees.channels.online')
const defaultChannel: string = config.get<string>('fees.channels.paper')
const issueEvent: string = config.get<string>('fees.issueFee.event')
const hearingEvent: string = config.get<string>('fees.hearingFee.event')
const baseFeeUri: string = `${config.get('fees.url')}`

const feeOutcome = {
  code: 'X0002',
  description: 'Civil Court fees - Money Claims - Claim Amount - 300.01 up to 500 GBP',
  version: 1,
  fee_amount: 50
}

const feeRange = [
  {
    code: 'X0024',
    fee_type: 'ranged',
    channel_type: {
      name: 'online'
    },
    direction_type: {
      name: 'enhanced'
    },
    event_type: {
      name: 'issue'
    },
    jurisdiction1: {
      name: 'civil'
    },
    jurisdiction2: {
      name: 'county court'
    },
    service_type: {
      name: 'civil money claims'
    },
    fee_versions: [
      {
        version: 1,
        description: 'Civil Court fees - Money Claims Online - Claim Amount - 0.01 upto 300 GBP',
        status: 'approved',
        flat_amount: {
          amount: 25
        },
        author: 'LOADER',
        approvedBy: 'LOADER'
      }
    ],
    current_version: {
      version: 1,
      description: 'Civil Court fees - Money Claims Online - Claim Amount - 0.01 upto 300 GBP',
      status: 'approved',
      flat_amount: {
        amount: 25
      },
      author: 'LOADER',
      approvedBy: 'LOADER'
    },
    min_range: 0,
    max_range: 300,
    range_unit: 'GBP',
    unspecified_claim_amount: false
  }
]

export function resolveCalculateIssueFee (): mock.Scope {
  return resolveCalculateFee(issueEvent)
}

export function rejectCalculateIssueFee (reason: string = 'HTTP error'): mock.Scope {
  return rejectCalculateFee(issueEvent, reason)
}

export function resolveCalculateHearingFee (): mock.Scope {
  return resolveCalculateFee(hearingEvent)
}

export function rejectCalculateHearingFee (reason: string = 'HTTP error'): mock.Scope {
  return rejectCalculateFee(hearingEvent, reason)
}

export function resolveGetIssueFeeRangeGroup (): mock.Scope {
  return resolveGetFeeRangeGroup(issueEvent)
}

export function rejectGetIssueFeeRangeGroup (reason: string = 'HTTP error'): mock.Scope {
  return rejectGetFeeRangeGroup(issueEvent, reason)
}

export function resolveGetHearingFeeRangeGroup (): mock.Scope {
  return resolveGetFeeRangeGroup(hearingEvent)
}

export function rejectGetHearingFeeRangeGroup (reason: string = 'HTTP error'): mock.Scope {
  return rejectGetFeeRangeGroup(hearingEvent, reason)
}

export function resolveCalculateFee (eventType: string): mock.Scope {
  // const encodedUri: string = encodeURIComponent(`?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&amount_or_volume=${amount}`)
  return mock(baseFeeUri)
    .get(`/fees-register/fees/lookup`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${onlineChannel}`,
      event: `${eventType}`,
      amount_or_volume: new RegExp(`[\\d]+`)
    })
    .reply(HttpStatus.OK, feeOutcome)
}

export function rejectCalculateFee (eventType: string, reason: string = 'HTTP error'): mock.Scope {
  // const encodedUri: string = encodeURIComponent(`\\?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&amount_or_volume=${amount}`)
  return mock(baseFeeUri)
    .get(`/fees-register/fees/lookup`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${onlineChannel}`,
      event: `${eventType}`,
      amount_or_volume: new RegExp(`[\\d]+`)
    })
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

function resolveGetFeeRangeGroup (eventType: string): mock.Scope {
  // const encodedUri: string = encodeURIComponent(`?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${issueEvent}&feeVersionStatus=approved`)
  return mock(baseFeeUri)
    .get(`/fees-register/fees`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${onlineChannel}`,
      event: `${eventType}`,
      feeVersionStatus: `approved`
    })
    .reply(HttpStatus.OK, feeRange)
}

function rejectGetFeeRangeGroup (eventType: string, reason: string = 'HTTP error'): mock.Scope {
  // const encodeUri: string = encodeURIComponent(`?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${issueEvent}&feeVersionStatus=approved`)
  return mock(baseFeeUri)
    .get(`/fees-register/fees`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${onlineChannel}`,
      event: `${eventType}`,
      feeVersionStatus: `approved`
    })
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
