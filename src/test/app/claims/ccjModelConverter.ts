import { expect } from 'chai'
import { CCJModelConverter } from 'claims/ccjModelConverter'
// Claim Data
import { fullAdmissionWithImmediatePaymentData } from 'test/data/entity/responseData'
// Claimant-Response Draft and Data
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { claimantResponseDraftWithPaymentMethodAccepted } from 'test/data/draft/claimantResponseDraftWithPaymentMethodAccepted'
// CCJ Draft and Data
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { fullAdmissionClaimantAcceptedPayImmediatelyData, ccjIssueRequest } from 'test/data/entity/ccjData'
import { Claim } from 'claims/models/claim'
import { Response } from 'claims/models/response'
import { Draft } from '@hmcts/draft-store-client'

// import { company, individual, organisation, soleTrader } from 'test/data/draft/partyDetails'
// import { company, individual, organisation, soleTrader } from 'test/data/entity/party'

function prepareClaim (responseTemplate: any): Claim {
  const claim = new Claim()
  claim.response = Response.deserialize(fullAdmissionWithImmediatePaymentData)
  return claim
}

function prepareDraft (draftTemplate: any): Draft<DraftClaimantResponse> {
  return new Draft(0, 'claimantResponse', new DraftClaimantResponse().deserialize(draftTemplate), undefined, undefined)
}

function prepareCCJData (template, party: object): CountyCourtJudgment {
  return CountyCourtJudgment.deserialize({
  })
}

function preparePartialCCJData (template, party: object): CountyCourtJudgment {
  return CountyCourtJudgment.deserialize({
  })
}

// Will require a prepareCCJDraft

function convertObjectLiteralToJSON (value: object): object {
  return JSON.parse(JSON.stringify(value))
}

describe('CCJModelConverter', () => {
  it('should convert', () => {
    const claim = prepareClaim(fullAdmissionWithImmediatePaymentData)
    const draft = prepareDraft(claimantResponseDraftWithPaymentMethodAccepted)

    expect(convertObjectLiteralToJSON(CCJModelConverter.convertForIssue(claim, draft)))
      .to.be.deep.equal(convertObjectLiteralToJSON(ccjIssueRequest))
  })
})
