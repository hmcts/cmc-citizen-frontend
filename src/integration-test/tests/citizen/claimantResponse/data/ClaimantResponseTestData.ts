
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

export class ClaimantResponseTestData {

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

}
