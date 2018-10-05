import { expect } from 'chai'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { fullAdmissionWithImmediatePaymentData,
  fullAdmissionWithPaymentBySetDateData,
  fullAdmissionWithPaymentByInstalmentsData,
  partialAdmissionWithImmediatePaymentCompanyData,
  partialAdmissionWithPaymentBySetDateCompanyData,
  partialAdmissionWithPaymentByInstalmentsCompanyData
 } from 'test/data/entity/responseData'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { claimantResponseDraftWithPaymentMethodAccepted
} from 'test/data/draft/claimantResponseDraft'
import {
  ccjIssueRequestPayImmediately,
  ccjIssueRequestPayBySetDate,
  ccjIssueRequestPayByInstalments,
  ccjIssueRequestPayImmediatelyForCompany,
  ccjIssueRequestPayBySetDateForCompany,
  ccjIssueRequestPayByInstalmentsForCompany
} from 'test/data/entity/ccjData'
import { Claim } from 'claims/models/claim'
import { Response } from 'claims/models/response'
import { Draft } from '@hmcts/draft-store-client'

function prepareClaim (responseTemplate: any): Claim {
  const claim = new Claim()
  claim.response = Response.deserialize(responseTemplate)
  return claim
}

function prepareDraft (draftTemplate: any): Draft<DraftClaimantResponse> {
  return new Draft(0, 'claimantResponse', new DraftClaimantResponse().deserialize(draftTemplate), undefined, undefined)
}

function convertObjectLiteralToJSON (value: object): object {
  return JSON.parse(JSON.stringify(value))
}

describe('CCJModelConverter - full admission by individual - claimant accepts', () => {
  it('should convert to CCJ - defendant pays immediately', () => {
    const claim = prepareClaim(fullAdmissionWithImmediatePaymentData)
    const draft = prepareDraft(claimantResponseDraftWithPaymentMethodAccepted)

    expect(convertObjectLiteralToJSON(CCJModelConverter.convertForIssue(claim, draft)))
      .to.be.deep.equal(convertObjectLiteralToJSON(ccjIssueRequestPayImmediately))
  })
  it('should convert to CCJ - defendant pays by set date', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentBySetDateData)
    const draft = prepareDraft(claimantResponseDraftWithPaymentMethodAccepted)

    expect(convertObjectLiteralToJSON(CCJModelConverter.convertForIssue(claim, draft)))
      .to.be.deep.equal(convertObjectLiteralToJSON(ccjIssueRequestPayBySetDate))
  })
  it('should convert CCJ - defendant pays by instalments', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentByInstalmentsData)
    const draft = prepareDraft(claimantResponseDraftWithPaymentMethodAccepted)

    console.log(CCJModelConverter.convertForIssue(claim, draft))
    expect(convertObjectLiteralToJSON(CCJModelConverter.convertForIssue(claim, draft)))
      .to.be.deep.equal(convertObjectLiteralToJSON(ccjIssueRequestPayByInstalments))
  })

})

describe('CCJModelConverter - part admission made by company - claimant accepts', () => {
  it('should convert to CCJ - defendant pays immediately', () => {
    const claim = prepareClaim(partialAdmissionWithImmediatePaymentCompanyData)
    const draft = prepareDraft(claimantResponseDraftWithPaymentMethodAccepted)

    expect(convertObjectLiteralToJSON(CCJModelConverter.convertForIssue(claim, draft)))
      .to.be.deep.equal(convertObjectLiteralToJSON(ccjIssueRequestPayImmediatelyForCompany))
  })
  it('should convert to CCJ - defendant pays by set date', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentBySetDateCompanyData)
    const draft = prepareDraft(claimantResponseDraftWithPaymentMethodAccepted)

    expect(convertObjectLiteralToJSON(CCJModelConverter.convertForIssue(claim, draft)))
      .to.be.deep.equal(convertObjectLiteralToJSON(ccjIssueRequestPayBySetDateForCompany))
  })
  it('should convert CCJ - defendant pays by instalments', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentByInstalmentsCompanyData)
    const draft = prepareDraft(claimantResponseDraftWithPaymentMethodAccepted)

    expect(convertObjectLiteralToJSON(CCJModelConverter.convertForIssue(claim, draft)))
      .to.be.deep.equal(convertObjectLiteralToJSON(ccjIssueRequestPayByInstalmentsForCompany))
  })
})
