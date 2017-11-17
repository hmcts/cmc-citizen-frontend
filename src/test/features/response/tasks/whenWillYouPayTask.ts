import { expect } from 'chai'

import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'

import { ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentType, DefendantPaymentOption } from 'response/form/models/defendantPaymentOption'

describe('WhenWillYouPayTask', () => {

  describe('when response', () => {
    it('should be completed when option is selected', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.defendantPaymentOption = new DefendantPaymentOption().deserialize({ option: { value: DefendantPaymentType.INSTALMENTS.value } })
      expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(true)
    })

    it('should be completed when option is undefined', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.defendantPaymentOption = new DefendantPaymentOption().deserialize(undefined)

      expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(false)
    })
  })

  describe('when response', () => {
    it('should be completed when option is selected', () => {
      DefendantPaymentType.all().forEach(option => {
        const draft = new ResponseDraft()
        draft.defendantPaymentOption = new DefendantPaymentOption(option)
        expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(true)
      })
    })

  })
})
