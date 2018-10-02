/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { YesNoOption } from 'models/yesNoOption'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { PartPaymentReceivedTask } from 'claimant-response/tasks/states-paid/partPaymentReceivedTask'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'

describe('AcceptPaymentMethodTask', () => {
  it('should not be completed when partPaymentReceived object is undefined', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({ partPaymentReceived: undefined })
    expect(PartPaymentReceivedTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when partPaymentReceived option is not selected', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        partPaymentReceived: new PartPaymentReceived(YesNoOption.fromObject(undefined))
      })
    expect(PartPaymentReceivedTask.isCompleted(draft)).to.be.false
  })

  it('should be completed when partPaymentReceived is set to no but reason is undefined', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        partPaymentReceived: new PartPaymentReceived(YesNoOption.NO)
      })
    expect(PartPaymentReceivedTask.isCompleted(draft)).to.be.true
  })

  it('should be completed when partPaymentReceived option is selected as yes', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        partPaymentReceived: new PartPaymentReceived(YesNoOption.YES)
      })
    expect(PartPaymentReceivedTask.isCompleted(draft)).to.be.true
  })

  it('should be completed when partPaymentReceived is set to no selected and reason is complete', () => {
    const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize(
      {
        partPaymentReceived: new PartPaymentReceived(YesNoOption.NO),
        rejectionReason: new RejectionReason('reason')
      })
    expect(PartPaymentReceivedTask.isCompleted(draft)).to.be.true
  })
})
