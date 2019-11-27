/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { CCJModelConverter, retrievePaymentOptionsFromClaim } from 'claims/ccjModelConverter'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { PaymentOption } from 'claims/models/paymentOption'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { Moment } from 'moment'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import {
  baseFullAdmissionData,
  baseResponseData,
  statementOfMeansWithAllFieldsData
} from 'test/data/entity/responseData'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'claims/models/madeBy'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { LocalDate } from 'forms/models/localDate'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { MomentFactory } from 'shared/momentFactory'

const ccjDraft = new DraftCCJ().deserialize({
  paymentOption: {
    option: PaymentType.IMMEDIATELY
  },
  paidAmount: {
    option: {
      value: 'no'
    },
    claimedAmount: 1060
  }
})

const dob: LocalDate = new LocalDate(1999, 1, 1)

const ccjDraftWithDefendantDOBKnown = new DraftCCJ().deserialize({
  paymentOption: {
    option: PaymentType.IMMEDIATELY
  },
  defendantDateOfBirth: {
    known: true,
    date: dob
  },
  paidAmount: {
    option: {
      value: 'no'
    },
    claimedAmount: 1060
  }
})

const ccjDraftWithInstallments = new DraftCCJ().deserialize({
  paymentOption: {
    option: PaymentType.INSTALMENTS
  },
  defendantDateOfBirth: {
    known: true,
    date: dob
  },
  repaymentPlan: {
    remainingAmount: 4060,
    instalmentAmount: 100,
    firstPaymentDate: new LocalDate(2010, 12, 30),
    paymentSchedule: {
      value: 'EACH_WEEK',
      displayValue: 'Each week'
    }
  },
  paidAmount: {
    option: {
      value: 'no'
    },
    claimedAmount: 4060
  }

})

const fullAdmissionResponseWithSetDateAndPaymentDateElapsed = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: '2010-12-31'
  },
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

const repaymentPlanPaymentIntention = {
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: MomentFactory.currentDate().subtract(10,'day'),
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: '2051-12-31',
      paymentLength: '1'
    }
  }
}

const fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  ...repaymentPlanPaymentIntention,
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

const sampleClaimWithFullAdmissionWithSetDateResponseObj = {
  ...claimStoreMock.sampleClaimIssueObj,
  response: fullAdmissionResponseWithSetDateAndPaymentDateElapsed
}

const sampleClaimWithFullAdmissionWithInstallmentsResponseObj = {
  ...claimStoreMock.sampleClaimIssueObj,
  response: fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed,
  settlement: {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: MadeBy.DEFENDANT.value,
        offer: {
          content: 'My offer contents here.',
          completionDate: '2020-10-10',
          ...repaymentPlanPaymentIntention
        }
      },
      {
        madeBy: MadeBy.CLAIMANT.value,
        type: StatementType.ACCEPTATION.value
      }
    ]
  }
}

describe('CCJModelConverter - convert CCJDraft to CountyCourtJudgement', () => {

  it('should convert to CCJ - for a valid CCJ draft', () => {
    const draft: DraftCCJ = ccjDraft
    const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimIssueObj)
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft, claim)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(undefined, PaymentOption.IMMEDIATELY, undefined, undefined, undefined, undefined, CountyCourtJudgmentType.DEFAULT))
  })

  it('should convert to CCJ - for a valid CCJ draft for full admission response paying by set date on breach of payment terms', () => {
    const draft: DraftCCJ = ccjDraftWithDefendantDOBKnown
    const claim: Claim = new Claim().deserialize(sampleClaimWithFullAdmissionWithSetDateResponseObj)
    const DOB: Moment = dob.toMoment()
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft, claim)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(DOB, PaymentOption.IMMEDIATELY, undefined, undefined, undefined, undefined, CountyCourtJudgmentType.ADMISSIONS))
  })

  it('should convert to CCJ - for a valid CCJ draft for full admission response paying by installments on breach of payment terms', () => {
    const draft: DraftCCJ = ccjDraftWithInstallments
    const claim: Claim = new Claim().deserialize(sampleClaimWithFullAdmissionWithInstallmentsResponseObj)
    const expectedRepaymentPlan: RepaymentPlan = new RepaymentPlan(100, new LocalDate(2010, 12, 30).toMoment(), 'EACH_WEEK')
    const DOB: Moment = dob.toMoment()
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft, claim)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(
      DOB,
      PaymentOption.INSTALMENTS,
      undefined,
      expectedRepaymentPlan,
      undefined,
      undefined,
      CountyCourtJudgmentType.ADMISSIONS)
    )
  })
}
)

describe('CCJModelConverter - Unit test on ModelConverter', () => {
  const sampleClaimWithInstalments = {
    ...claimStoreMock.sampleClaimIssueObj,
    response: fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed,
    settlement: {
      partyStatements: [
        {
          type: StatementType.OFFER.value,
          madeBy: MadeBy.DEFENDANT.value,
          offer: {
            content: 'My offer contents here.',
            completionDate: '2020-10-10',
            ...repaymentPlanPaymentIntention
          }
        },
        {
          madeBy: MadeBy.CLAIMANT.value,
          type: StatementType.ACCEPTATION.value
        }
      ]
    },
    settlementReachedAt: new LocalDate(2010, 1, 1).toMoment()
  }
  it('should get undefined CCJPaymentOption when response not present', () => {
    const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimIssueObj)
    const ccjPaymentOption: CCJPaymentOption = retrievePaymentOptionsFromClaim(claim)
    expect(ccjPaymentOption).to.be.undefined
  })
  it('should get defined CCJPaymentOption when response is present', () => {
    const claim: Claim = new Claim().deserialize(sampleClaimWithInstalments)
    const ccjPaymentOption: CCJPaymentOption = retrievePaymentOptionsFromClaim(claim)
    expect(ccjPaymentOption.option.value).to.be.equal(PaymentType.INSTALMENTS.value)
  })
})
