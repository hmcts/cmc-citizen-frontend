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
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import {
  baseFullAdmissionData,
  baseResponseData,
  statementOfMeansWithAllFieldsData
} from 'test/data/entity/responseData'

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

const fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: '2010-12-31',
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: '2051-12-31',
      paymentLength: '1'
    }
  },
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
  response: fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed
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
    let expectedPaymentDate: Moment = (claim.response as FullAdmissionResponse).paymentIntention.paymentDate
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft, claim)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(undefined, PaymentOption.BY_SPECIFIED_DATE, undefined, undefined, expectedPaymentDate, undefined, CountyCourtJudgmentType.ADMISSIONS))
  })

  it('should convert to CCJ - for a valid CCJ draft for full admission response paying by installments on breach of payment terms', () => {
    const draft: DraftCCJ = ccjDraft
    const claim: Claim = new Claim().deserialize(sampleClaimWithFullAdmissionWithInstallmentsResponseObj)
    // @ts-ignore
    let expectedRepaymentPlan: RepaymentPlan = (claim.response as FullAdmissionResponse).paymentIntention.repaymentPlan
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft, claim)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(
      undefined,
      PaymentOption.INSTALMENTS,
      undefined,
      expectedRepaymentPlan,
      undefined,
      undefined,
      CountyCourtJudgmentType.ADMISSIONS))
  })

})
