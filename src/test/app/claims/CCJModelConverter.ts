import { expect } from 'chai'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { PaymentOption } from 'claims/models/paymentOption'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { sampleClaimIssueObj } from 'test/http-mocks/claim-store'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import {
  baseFullAdmissionData,
  baseResponseData,
  statementOfMeansWithAllFieldsData
} from 'test/data/entity/responseData'
import { Individual } from 'claims/models/details/yours/individual'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'
import { RepaymentPlan } from 'claims/models/repaymentPlan'

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

const ccjDraftWithInstallments = new DraftCCJ().deserialize({
  paymentOption: {
    option: PaymentType.INSTALMENTS,
  },
  repaymentPlan: {
    remainingAmount: 3685,
    instalmentAmount: 100,
    firstPaymentDate: {
      year: 2010,
      month: 11,
      day: 31
    },
    paymentSchedule: {
      value: 'EVERY_MONTH',
      displayValue: 'every month'
    }
  },
  paidAmount: {
    option: {
      value: 'no'
    },
    claimedAmount: 1060
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
      firstPaymentDate: '2010-12-31',
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: '2051-12-31',
      paymentLength: '1'
    }
  }
}

const repaymentPlan = {
  instalmentAmount: 100,
  firstPaymentDate: '2010-12-31',
  paymentSchedule: PaymentSchedule.EACH_WEEK,
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
  ...sampleClaimIssueObj,
  response: fullAdmissionResponseWithSetDateAndPaymentDateElapsed
}

const sampleClaimWithFullAdmissionWithInstallmentsResponseObj = {
  ...sampleClaimIssueObj,
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
    const draft: DraftCCJ = ccjDraft
    const claim: Claim = new Claim().deserialize(sampleClaimWithFullAdmissionWithSetDateResponseObj)
    const DOB: Moment = MomentFactory.parse((claim.response.defendant as Individual).dateOfBirth)
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft, claim)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(DOB, PaymentOption.IMMEDIATELY, undefined, undefined, undefined, undefined, CountyCourtJudgmentType.ADMISSIONS))
  })

  it('should convert to CCJ - for a valid CCJ draft for full admission response paying by installments on breach of payment terms', () => {
    const draft: DraftCCJ = ccjDraftWithInstallments
    const claim: Claim = new Claim().deserialize(sampleClaimWithFullAdmissionWithInstallmentsResponseObj)
    const expectedRepaymentPlan: RepaymentPlan = new RepaymentPlan().deserialize(repaymentPlan)
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft, claim)
    const DOB: Moment = MomentFactory.parse((claim.response.defendant as Individual).dateOfBirth)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(
      DOB,
      PaymentOption.INSTALMENTS,
      undefined,
      expectedRepaymentPlan,
      undefined,
      undefined,
      CountyCourtJudgmentType.ADMISSIONS))
  })

})
