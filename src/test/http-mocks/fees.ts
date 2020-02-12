import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const service = config.get<string>('fees.service')
const jurisdiction1 = config.get<string>('fees.jurisdiction1')
const jurisdiction2 = config.get<string>('fees.jurisdiction2')
const onlineChannel = config.get<string>('fees.channel.online')
const defaultChannel = config.get<string>('fees.channel.paper')
const issueEvent = config.get<string>('fees.issueFee.event')
const hearingEvent = config.get<string>('fees.hearingFee.event')
const baseFeeUri = config.get<string>('fees.url')

const feeOutcome = {
  code: 'X0002',
  description: 'Civil Court fees - Money Claims - Claim Amount - 300.01 up to 500 GBP',
  version: 1,
  fee_amount: 50
}

export const feeRange = [
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
  },
  {
    'code': 'FEE0212',
    'fee_type': 'ranged',
    'channel_type': {
      'name': 'online'
    },
    'event_type': {
      'name': 'issue'
    },
    'jurisdiction1': {
      'name': 'civil'
    },
    'jurisdiction2': {
      'name': 'county court'
    },
    'service_type': {
      'name': 'civil money claims'
    },
    'applicant_type': {
      'name': 'all'
    },
    'fee_versions': [
      {
        'description': 'Civil Court fees - Money Claims Online - Claim Amount - 300.01 upto 500 GBP',
        'status': 'approved',
        'version': 3,
        'valid_from': '2014-04-22T00:00:00.000+0000',
        'valid_to': '2014-04-22T00:00:00.000+0000',
        'flat_amount': {
          'amount': 35.00
        },
        'memo_line': 'GOV.UK Pay online claims - Money Claim £300-500',
        'natural_account_code': '4481102133',
        'direction': 'enhanced'
      },
      {
        'description': 'Money Claims Online - Claim Amount - 300.01 upto 500 GBP',
        'status': 'approved',
        'author': '124756',
        'approvedBy': '39907',
        'version': 4,
        'valid_from': '2014-04-22T00:00:00.000+0000',
        'valid_to': '2014-04-22T00:00:00.000+0000',
        'flat_amount': {
          'amount': 35.00
        },
        'memo_line': 'RECEIPT OF FEES - Civil issue money',
        'statutory_instrument': '2015 No 576',
        'si_ref_id': '1.2b',
        'natural_account_code': '4481102133',
        'fee_order_name': 'Civil Proceedings',
        'direction': 'enhanced'
      },
      {
        'description': 'Money Claims Discounted - Claim Amount - 300.01 up to 500 GBP',
        'status': 'approved',
        'author': '124756',
        'approvedBy': '39907',
        'version': 5,
        'valid_from': '2014-04-22T00:00:00.000+0000',
        'flat_amount': {
          'amount': 35.00
        },
        'memo_line': 'RECEIPT OF FEES - Civil issue money',
        'statutory_instrument': '2015 No 576',
        'si_ref_id': '1.2b',
        'natural_account_code': '4481102133',
        'fee_order_name': 'Civil Proceedings',
        'direction': 'enhanced'
      }
    ],
    'current_version': {
      'description': 'Money Claims Online - Claim Amount - 300.01 upto 500 GBP',
      'status': 'approved',
      'author': '124756',
      'approvedBy': '39907',
      'version': 4,
      'valid_from': '2014-04-22T00:00:00.000+0000',
      'valid_to': '2014-04-22T00:00:00.000+0000',
      'flat_amount': {
        'amount': 35.00
      },
      'memo_line': 'RECEIPT OF FEES - Civil issue money',
      'statutory_instrument': '2015 No 576',
      'si_ref_id': '1.2b',
      'natural_account_code': '4481102133',
      'fee_order_name': 'Civil Proceedings',
      'direction': 'enhanced'
    },
    'min_range': 300.01,
    'max_range': 500.00,
    'range_unit': 'GBP',
    'unspecified_claim_amount': false,
    'matching_version': {
      'description': 'Money Claims Online - Claim Amount - 300.01 upto 500 GBP',
      'status': 'approved',
      'author': '124756',
      'approvedBy': '39907',
      'version': 4,
      'valid_from': '2014-04-22T00:00:00.000+0000',
      'valid_to': '2014-04-22T00:00:00.000+0000',
      'flat_amount': {
        'amount': 35.00
      },
      'memo_line': 'RECEIPT OF FEES - Civil issue money',
      'statutory_instrument': '2015 No 576',
      'si_ref_id': '1.2b',
      'natural_account_code': '4481102133',
      'fee_order_name': 'Civil Proceedings',
      'direction': 'enhanced'
    }
  },
  {
    'code': 'FEE0212',
    'fee_type': 'ranged',
    'channel_type': {
      'name': 'online'
    },
    'event_type': {
      'name': 'issue'
    },
    'jurisdiction1': {
      'name': 'civil'
    },
    'jurisdiction2': {
      'name': 'county court'
    },
    'service_type': {
      'name': 'civil money claims'
    },
    'applicant_type': {
      'name': 'all'
    },
    'fee_versions': [
      {
        'description': 'Civil Court fees - Money Claims Online - Claim Amount - 300.01 upto 500 GBP',
        'status': 'approved',
        'version': 3,
        'valid_from': '2014-04-22T00:00:00.000+0000',
        'valid_to': '2014-04-22T00:00:00.000+0000',
        'flat_amount': {
          'amount': 35.00
        },
        'memo_line': 'GOV.UK Pay online claims - Money Claim £300-500',
        'natural_account_code': '4481102133',
        'direction': 'enhanced'
      },
      {
        'description': 'Money Claims Online - Claim Amount - 300.01 upto 500 GBP',
        'status': 'approved',
        'author': '124756',
        'approvedBy': '39907',
        'version': 4,
        'valid_from': '2014-04-22T00:00:00.000+0000',
        'valid_to': '2014-04-22T00:00:00.000+0000',
        'flat_amount': {
          'amount': 35.00
        },
        'memo_line': 'RECEIPT OF FEES - Civil issue money',
        'statutory_instrument': '2015 No 576',
        'si_ref_id': '1.2b',
        'natural_account_code': '4481102133',
        'fee_order_name': 'Civil Proceedings',
        'direction': 'enhanced'
      },
      {
        'description': 'Money Claims Discounted - Claim Amount - 300.01 up to 500 GBP',
        'status': 'approved',
        'author': '124756',
        'approvedBy': '39907',
        'version': 5,
        'valid_from': '2014-04-22T00:00:00.000+0000',
        'flat_amount': {
          'amount': 35.00
        },
        'memo_line': 'RECEIPT OF FEES - Civil issue money',
        'statutory_instrument': '2015 No 576',
        'si_ref_id': '1.2b',
        'natural_account_code': '4481102133',
        'fee_order_name': 'Civil Proceedings',
        'direction': 'enhanced'
      }
    ],
    'current_version': {
      'description': 'Money Claims Discounted - Claim Amount - 300.01 up to 500 GBP',
      'status': 'approved',
      'author': '124756',
      'approvedBy': '39907',
      'version': 5,
      'valid_from': '2014-04-22T00:00:00.000+0000',
      'flat_amount': {
        'amount': 35.00
      },
      'memo_line': 'RECEIPT OF FEES - Civil issue money',
      'statutory_instrument': '2015 No 576',
      'si_ref_id': '1.2b',
      'natural_account_code': '4481102133',
      'fee_order_name': 'Civil Proceedings',
      'direction': 'enhanced'
    },
    'min_range': 300.01,
    'max_range': 500.00,
    'range_unit': 'GBP',
    'unspecified_claim_amount': false,
    'matching_version': {
      'description': 'Money Claims Discounted - Claim Amount - 300.01 up to 500 GBP',
      'status': 'approved',
      'author': '124756',
      'approvedBy': '39907',
      'version': 5,
      'valid_from': '2014-04-22T00:00:00.000+0000',
      'flat_amount': {
        'amount': 35.00
      },
      'memo_line': 'RECEIPT OF FEES - Civil issue money',
      'statutory_instrument': '2015 No 576',
      'si_ref_id': '1.2b',
      'natural_account_code': '4481102133',
      'fee_order_name': 'Civil Proceedings',
      'direction': 'enhanced'
    }
  }
]

export function resolveCalculateIssueFee (): mock.Scope {
  return resolveCalculateFee(issueEvent, onlineChannel)
}

export function rejectCalculateIssueFee (reason: string = 'HTTP error'): mock.Scope {
  return rejectCalculateFee(issueEvent, onlineChannel, reason)
}

export function resolveCalculateHearingFee (): mock.Scope {
  return resolveCalculateFee(hearingEvent, defaultChannel)
}

export function rejectCalculateHearingFee (reason: string = 'HTTP error'): mock.Scope {
  return rejectCalculateFee(hearingEvent, defaultChannel, reason)
}

export function resolveGetIssueFeeRangeGroup (): mock.Scope {
  return resolveGetFeeRangeGroup(issueEvent, onlineChannel)
}

export function rejectGetIssueFeeRangeGroup (reason: string = 'HTTP error'): mock.Scope {
  return rejectGetFeeRangeGroup(issueEvent, onlineChannel, reason)
}

export function resolveGetHearingFeeRangeGroup (): mock.Scope {
  return resolveGetFeeRangeGroup(hearingEvent, defaultChannel)
}

export function rejectGetHearingFeeRangeGroup (reason: string = 'HTTP error'): mock.Scope {
  return rejectGetFeeRangeGroup(hearingEvent, defaultChannel, reason)
}

export function resolveCalculateFee (eventType: string, channel: string): mock.Scope {
  return mock(baseFeeUri)
    .get(`/fees-register/fees/lookup`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${channel}`,
      event: `${eventType}`,
      amount_or_volume: new RegExp(`[\\d]+`)
    })
    .reply(HttpStatus.OK, feeOutcome)
}

export function rejectCalculateFee (eventType: string, channel: string, reason: string = 'HTTP error'): mock.Scope {
  return mock(baseFeeUri)
    .get(`/fees-register/fees/lookup`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${channel}`,
      event: `${eventType}`,
      amount_or_volume: new RegExp(`[\\d]+`)
    })
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

function resolveGetFeeRangeGroup (eventType: string, channel: string): mock.Scope {
  return mock(baseFeeUri)
    .get(`/fees-register/fees`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${channel}`,
      event: `${eventType}`,
      feeVersionStatus: `approved`
    })
    .reply(HttpStatus.OK, feeRange)
}

function rejectGetFeeRangeGroup (eventType: string, channel: string, reason: string = 'HTTP error'): mock.Scope {
  return mock(baseFeeUri)
    .get(`/fees-register/fees`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${channel}`,
      event: `${eventType}`,
      feeVersionStatus: `approved`
    })
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
