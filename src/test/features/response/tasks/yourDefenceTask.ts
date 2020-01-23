/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Defence } from 'response/form/models/defence'

import { YourDefenceTask } from 'response/tasks/yourDefenceTask'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { TimelineRow } from 'forms/models/timelineRow'
import { generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

const VALID_DEFENCE_TEXT = 'this is valid defence'

describe('Your defence task', () => {

  context('should not be completed when', () => {

    it('defence object is undefined', () => {
      const draft = new ResponseDraft()
      draft.defence = undefined
      draft.timeline = new DefendantTimeline()

      expect(YourDefenceTask.isCompleted(draft)).to.be.false
    })

    it('timeline object is undefined', () => {
      const draft = new ResponseDraft()
      draft.defence = new Defence(VALID_DEFENCE_TEXT)
      draft.timeline = undefined

      expect(YourDefenceTask.isCompleted(draft)).to.be.false
    })

    it('defence text is invalid', () => {
      [undefined, '', ' '].forEach(defence => {
        const draft = new ResponseDraft()
        draft.defence = new Defence(defence)
        draft.timeline = new DefendantTimeline()

        expect(YourDefenceTask.isCompleted(draft)).to.be.false
      })
    })

    it('timelineRow is invalid', () => {
      const draft = new ResponseDraft()
      draft.defence = new Defence(VALID_DEFENCE_TEXT)
      draft.timeline = new DefendantTimeline([new TimelineRow('', 'invalid')])

      expect(YourDefenceTask.isCompleted(draft)).to.be.false
    })

    it('timeline comment is too long', () => {
      const draft = new ResponseDraft()
      draft.defence = new Defence(VALID_DEFENCE_TEXT)
      draft.timeline = new DefendantTimeline(
        [new TimelineRow('a', 'valid')],
        generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
      )

      expect(YourDefenceTask.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when', () => {

    it('both defence and timeline are valid', () => {
      const draft = new ResponseDraft()
      draft.defence = new Defence(VALID_DEFENCE_TEXT)
      draft.timeline = new DefendantTimeline(
        [new TimelineRow('valid date', 'valid description')], 'valid comment'
      )

      expect(YourDefenceTask.isCompleted(draft)).to.be.true
    })
  })
})
