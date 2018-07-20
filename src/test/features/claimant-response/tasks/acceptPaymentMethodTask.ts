/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { YesNoOption } from 'models/yesNoOption'
import { AcceptPaymentMethodTask } from 'claimant-response/tasks/acceptPaymentMethodTask'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'

describe('AcceptPaymentMethodTask', () => {
  it('should not be completed when acceptPaymentMethod object is undefined', () => {
    const draft = new DraftClaimantResponse()
    draft.acceptPaymentMethod = undefined

    expect(AcceptPaymentMethodTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when acceptPaymentMethod option is not selected', () => {
    const draft = new DraftClaimantResponse()
    draft.acceptPaymentMethod = new AcceptPaymentMethod(undefined)

    expect(AcceptPaymentMethodTask.isCompleted(draft)).to.be.false
  })

  it('should be completed when acceptPaymentMethod option is selected', () => {
    YesNoOption.all().forEach(option => {
      const draft = new DraftClaimantResponse()
      draft.acceptPaymentMethod = new AcceptPaymentMethod(option)

      expect(AcceptPaymentMethodTask.isCompleted(draft)).to.be.true
    })
  })
})
