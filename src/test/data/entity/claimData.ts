import { individual } from 'test/data/entity/party'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'common/interestDateType'
import { Interest } from 'claims/models/interest'
import * as moment from 'moment'

export const interestDateData = {
  type: InterestDateType.CUSTOM,
  date: moment({ year: 2018, month: 0, day: 1 }),
  reason: 'reason',
  endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
}

export const interestData = {
  interestBreakdown: undefined,
  type: InterestRateOption.DIFFERENT,
  rate: 10,
  reason: 'Special case',
  interestDate: interestDateData
}

export const claimData = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  claimants: [{ ...individual, email: undefined }],
  defendants: [{ ...individual, phone: undefined }],
  amount: {
    rows: [
      {
        amount: 1,
        reason: 'Valid reason'
      },
      {
        amount: undefined,
        reason: undefined
      },
      {
        amount: undefined,
        reason: undefined
      },
      {
        amount: undefined,
        reason: undefined
      }
    ],
    type: 'breakdown'
  },
  interest: interestData as Interest,
  reason: 'Because he did...',
  feeAmountInPennies: 1000000,
  payment: {
    reference: '123',
    date_created: 12345,
    amount: 10000,
    status: 'Success'
  },
  timeline: {
    rows: []
  },
  evidence: {
    rows: []
  }
}

export function defenceClaimData () {
  return {
    id: 1571828179733564,
    submitterId: '1f9d9e49-c52c-4ae2-8999-0012efb2ef88',
    letterHolderId: '4605000b-10b7-40da-83b3-c83241907859',
    defendantId: '1f9d9e49-c52c-4ae2-8999-0012efb2ef88',
    externalId: '62302059-cad1-40d1-9762-daede5cace7e',
    referenceNumber: '000MC001',
    createdAt: moment().subtract(2, 'days'),
    issuedOn: moment().subtract(2, 'days'),
    serviceDate: moment().subtract(2, 'days'),
    responseDeadline: moment().add(13, 'days'),
    moreTimeRequested: false,
    submitterEmail: 'sudheer.chakka@hmcts.net',
    respondedAt: moment(),
    response: {
      responseType: 'FULL_DEFENCE',
      freeMediation: 'yes',
      mediationPhoneNumber: '0876564678',
      moreTimeNeeded: 'no',
      defendant: {
        type: 'individual',
        id: '03f0d1fe-542a-40d6-a5a3-bbe9450a274a',
        name: 'Mrs. Mary Richards',
        address: {
          line1: 'Flat 3A',
          line2: 'Street 1',
          line3: 'Middle Road',
          city: 'London',
          postcode: 'SW1H 9AJ'
        },
        mobilePhone: '0876564678',
        dateOfBirth: '2000-01-01'
      },
      defenceType: 'DISPUTE',
      defence: 'sdfsdfds',
      timeline: {},
      evidence: {},
      directionsQuestionnaire: {
        requireSupport: {
          hearingLoop: 'no',
          disabledAccess: 'no'
        },
        hearingLocation: {
          courtName: 'Central London County Court',
          locationOption: 'SUGGESTED_COURT'
        },
        witness: {
          selfWitness: 'no'
        }
      }
    },
    defendantEmail: 'sudheer.chakka@hmcts.net',
    features: [
      'directionsQuestionnaire'
    ],
    claimantRespondedAt: moment(),
    claimantResponse: {
      type: 'REJECTION',
      freeMediation: 'yes',
      mediationPhoneNumber: '(0)207 127 0000',
      directionsQuestionnaire: {
        requireSupport: {
          hearingLoop: 'no',
          disabledAccess: 'no'
        },
        hearingLocation: {
          courtName: 'Central London County Court',
          locationOption: 'SUGGESTED_COURT'
        },
        witness: {
          selfWitness: 'no'
        }
      }
    },
    claimDocumentCollection: {
      claimDocuments: [
        {
          id: '682f9df1-3338-4f55-9c35-ebf98aabd77b',
          documentManagementUrl: 'http://dm-store:4460/documents/a99d573e-426c-4ecc-bd0c-8cecf9e4a4b6',
          documentManagementBinaryUrl: 'http://dm-store:4460/documents/a99d573e-426c-4ecc-bd0c-8cecf9e4a4b6/binary',
          documentName: '000MC001-claim-form.pdf',
          documentType: 'SEALED_CLAIM',
          createdDatetime: '2019-10-23T10:56:39.725',
          createdBy: 'OCMC',
          size: 79676
        },
        {
          id: '1d6d996c-f8bd-4609-809e-1474f9540ae4',
          documentManagementUrl: 'http://dm-store:4460/documents/74918d22-4403-4512-8509-05c48d819ad0',
          documentManagementBinaryUrl: 'http://dm-store:4460/documents/74918d22-4403-4512-8509-05c48d819ad0/binary',
          documentName: '000MC001-claim-form-claimant-copy.pdf',
          documentType: 'CLAIM_ISSUE_RECEIPT',
          createdDatetime: '2019-10-23T10:56:41.942',
          createdBy: 'OCMC',
          size: 72373
        },
        {
          id: '3d1e173b-97bd-48e9-8ddd-77b7a24360b7',
          documentManagementUrl: 'http://dm-store:4460/documents/3c96aee6-408f-4925-88ca-f185be0893ac',
          documentManagementBinaryUrl: 'http://dm-store:4460/documents/3c96aee6-408f-4925-88ca-f185be0893ac/binary',
          documentName: '000MC001-claim-response.pdf',
          documentType: 'DEFENDANT_RESPONSE_RECEIPT',
          createdDatetime: '2019-10-23T10:59:41.157',
          createdBy: 'OCMC',
          size: 18845
        },
        {
          id: '289ce11b-fa36-427a-9061-2020a9fd46b5',
          documentManagementUrl: 'http://dm-store:4460/documents/b3642400-84d1-40da-a47e-4449c2fb54a6',
          documentManagementBinaryUrl: 'http://dm-store:4460/documents/b3642400-84d1-40da-a47e-4449c2fb54a6/binary',
          documentName: '000MC001-claimant-hearing-questions.pdf',
          documentType: 'CLAIMANT_DIRECTIONS_QUESTIONNAIRE',
          createdDatetime: '2019-10-23T11:00:47.352',
          createdBy: 'OCMC',
          size: 10955
        }
      ]
    },
    claimSubmissionOperationIndicators: {
      claimantNotification: 'yes',
      defendantNotification: 'yes',
      bulkPrint: 'yes',
      rpa: 'yes',
      staffNotification: 'yes',
      sealedClaimUpload: 'yes',
      claimIssueReceiptUpload: 'yes'
    },
    ccdCaseId: 1571828179733564,
    intentionToProceedDeadline: moment().add(15, 'days'),
    totalInterestTillDateOfIssue: 0,
    totalClaimAmount: 75,
    totalInterest: 0,
    totalAmountTillToday: 100,
    totalAmountTillDateOfIssue: 100,
    amountWithInterest: 75,
    amountWithInterestUntilIssueDate: 75,
    claim: {
      externalId: '62302059-cad1-40d1-9762-daede5cace7e',
      claimants: [
        {
          type: 'individual',
          id: '43394969-53ba-4b49-a751-be77a7625b43',
          name: 'Jan Clark',
          address: {
            line1: 'Street 1',
            line2: 'Street 2',
            line3: 'Street 3',
            city: 'London',
            postcode: 'SW1H 9AJ'
          },
          mobilePhone: '(0)207 127 0000',
          dateOfBirth: '2000-01-01'
        }
      ],
      defendants: [
        {
          type: 'individual',
          id: '03f0d1fe-542a-40d6-a5a3-bbe9450a274a',
          name: 'Mrs. Mary Richards',
          address: {
            line1: 'Flat 3A',
            line2: 'Street 1',
            line3: 'Middle Road',
            city: 'London',
            postcode: 'SW1H 9AJ'
          },
          email: 'sudheer.chakka@hmcts.net',
          title: 'Mrs.',
          firstName: 'Mary',
          lastName: 'Richards'
        }
      ],
      payment: {
        amount: 25,
        reference: 'RC-1571-8281-6216-4827',
        status: 'SUCCESS'
      },
      amount: {
        type: 'breakdown',
        rows: [
          {
            id: 'a0172e82-0b46-46dc-bce2-8b365354fd0b',
            reason: 'Roof Fix & repairs to leak',
            amount: 75
          }
        ]
      },
      feeAmountInPennies: 2500,
      interest: {
        type: 'no interest'
      },
      timeline: {
        rows: [
          {
            id: '1790beae-9f79-4177-9c06-ce155ed668fe',
            date: '01 October 2017',
            description: 'The day the first bill was issued'
          },
          {
            id: '49791276-2a16-4cdb-b930-9eb643685edc',
            date: '26 March 2018',
            description: 'A historic day with enormous importance'
          },
          {
            id: 'b7712f6a-e587-464e-814b-29b0b77be9c6',
            date: '14 June 2018',
            description: 'line to explain what happened and when'
          }
        ]
      },
      reason: 'A strong sense of entitlement that would explain my reasons of the claim, that the Roof work and leaks that followed were done below standards set by the council inspector'
    }
  }
}
