import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { PaymentOption } from 'integration-test/data/payment-option'
import { DefenceType } from 'integration-test/data/defence-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'

const helperSteps: Helper = new Helper()

interface PageSpecificValues {
  paymentDatePage_enterDate: string
  paymentPlanPage_enterRepaymentPlan: PaymentPlan,
  howMuchHaveYouPaidPage_enterAmountPaidWithDateAndExplanation: {
    paidAmount: number,
    date: string,
    explanation: string
  },
  whyYouDisagreePage_enterReason: string,
  timelineEventsPage_enterTimelineEvent: {
    eventNum: number,
    date: string,
    description: string
  },
  evidencePage_enterEvidenceRow: {
    type: string,
    description: string,
    comment: string
  }
}

export class ClaimantResponseTest {

  claimRef: string
  defendantEmail: string
  defendantPartyType: PartyType
  paymentOption: PaymentOption
  defenceType: DefenceType
  claimantEmail: string
  claimantPartyType: PartyType
  claimantPaymentOption: PaymentOption
  pageSpecificValues: PageSpecificValues = {
    paymentDatePage_enterDate: '2025-01-01',
    paymentPlanPage_enterRepaymentPlan: {
      equalInstalment: 5.00,
      firstPaymentDate: '2025-01-01',
      frequency: 'everyMonth'
    },
    howMuchHaveYouPaidPage_enterAmountPaidWithDateAndExplanation: {
      paidAmount: 0,
      date: '',
      explanation: ''
    },
    whyYouDisagreePage_enterReason: 'Defendant rejects all the claim because...',
    timelineEventsPage_enterTimelineEvent: {
      eventNum: 0,
      date: '1/1/2000',
      description: 'something'
    },
    evidencePage_enterEvidenceRow: {
      type: 'CONTRACTS_AND_AGREEMENTS',
      description: 'correspondence',
      comment:  'have this evidence'
    }
  }

  public static async prepareData (I: I, defendantPartyType: PartyType, claimantPartyType: PartyType) {
    const claimantEmail: string = await I.getClaimantEmail()
    const defendantEmail: string = await I.getDefendantEmail()
    const claimData: ClaimData = await createClaimData(I, defendantPartyType, claimantPartyType)
    const claimRef: string = await I.createClaim(claimData, claimantEmail)

    await helperSteps.enterPinNumber(claimRef, claimantEmail)

    const testData = new ClaimantResponseTest()
    testData.claimRef = claimRef
    testData.claimantEmail = claimantEmail
    testData.defendantEmail = defendantEmail
    testData.defendantPartyType = defendantPartyType
    testData.claimantPartyType = claimantPartyType
    return testData
  }

}
