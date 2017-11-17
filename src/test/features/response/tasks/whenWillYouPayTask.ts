import { expect } from 'chai'

import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'

import { ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'

describe('WhenWillYouPayTask', () => {
  it('should not be completed when object is undefined', () => {
    const draft: ResponseDraft = new ResponseDraft()
    draft.defendantPaymentOption = undefined

    expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(false)
  })

  it('should not be completed when payment option is undefined', () => {
    const draft: ResponseDraft = new ResponseDraft()
    draft.defendantPaymentOption = new DefendantPaymentOption(undefined)

    expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(false)
  })

  it('should be completed when option is selected', () => {
    DefendantPaymentType.all().forEach(defendantPaymentType => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.defendantPaymentOption = new DefendantPaymentOption(defendantPaymentType)

      expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(true)
    })
  })
})
