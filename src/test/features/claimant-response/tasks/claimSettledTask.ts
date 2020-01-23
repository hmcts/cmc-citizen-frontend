/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { YesNoOption } from 'models/yesNoOption'
import { ClaimSettledTask } from 'claimant-response/tasks/states-paid/claimSettledTask'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'

describe('AcceptPaymentMethodTask', () => {
  it('should not be completed when accepted object is undefined', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({ accepted: undefined })
    expect(ClaimSettledTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when accepted option is not selected', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        accepted: new ClaimSettled(YesNoOption.fromObject(undefined))
      })
    expect(ClaimSettledTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when accepted is set to no but reason is undefined', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        accepted: new ClaimSettled(YesNoOption.NO),
        rejectionReason: undefined
      })
    expect(ClaimSettledTask.isCompleted(draft)).to.be.false
  })

  it('should be completed when accepted option is selected as yes', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        accepted: new ClaimSettled(YesNoOption.YES)
      })
    expect(ClaimSettledTask.isCompleted(draft)).to.be.true
  })

  it('should be completed when accepted is set to no selected and reason is complete', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        accepted: new ClaimSettled(YesNoOption.NO),
        rejectionReason: new RejectionReason('reason')
      })
    expect(ClaimSettledTask.isCompleted(draft)).to.be.true
  })
})
