
interface PageSpecificValues {
  paymentDatePageEnterDate: string
  paymentPlanPageEnterRepaymentPlan: PaymentPlan,
  howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation: {
    paidAmount: number,
    date: string,
    explanation: string
  },
  whyYouDisagreePageEnterReason: string,
  timelineEventsPageEnterTimelineEvent: {
    eventNum: number,
    date: string,
    description: string
  },
  evidencePageEnterEvidenceRow: {
    type: string,
    description: string,
    comment: string
  }
}

export class ClaimantResponseTestData {

  isExpectingToSeeHowTheyWantToPayPage: boolean = false
  isExpectingToSeeCourtOfferedInstalmentsPage: boolean = false
  pageSpecificValues: PageSpecificValues = {
    paymentDatePageEnterDate: '2025-01-01',
    paymentPlanPageEnterRepaymentPlan: {
      equalInstalment: 5.00,
      firstPaymentDate: '2025-01-01',
      frequency: 'everyMonth'
    },
    howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation: {
      paidAmount: 0,
      date: '',
      explanation: ''
    },
    whyYouDisagreePageEnterReason: 'Defendant rejects all the claim because...',
    timelineEventsPageEnterTimelineEvent: {
      eventNum: 0,
      date: '1/1/2000',
      description: 'something'
    },
    evidencePageEnterEvidenceRow: {
      type: 'CONTRACTS_AND_AGREEMENTS',
      description: 'correspondence',
      comment:  'have this evidence'
    }
  }

}
