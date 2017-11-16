import { expect } from 'chai'

import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'

import { ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentType, DefendantPaymentOption } from 'response/form/models/defendantPaymentOption'

describe('WhenWillYouPayTask', () => {
  describe('when no response', () => {
    it('should be not completed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined
      expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(false)
    })
  })

  describe('when respnse', () => {
    it('should be completed when option is selected', () => {
      DefendantPaymentType.all().forEach(option => {
        const draft = new ResponseDraft()
        draft.defendantPaymentOption = new DefendantPaymentOption(option)
        expect(WhenWillYouPayTask.isCompleted(draft)).to.equal(true)
      })
    })

  })
})
