/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Defence } from 'response/form/models/defence'

import { YourDefenceTask } from 'response/tasks/yourDefenceTask'

describe('Your defence task', () => {
  it('should not be completed when defence object is undefined', () => {
    const draft = new ResponseDraft()
    draft.defence = undefined

    expect(YourDefenceTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when defence text is invalid', () => {
    [undefined, '', ' '].forEach(defence => {
      const draft = new ResponseDraft()
      draft.defence = new Defence(defence)

      expect(YourDefenceTask.isCompleted(draft)).to.be.false
    })
  })

  it('should be completed when defence text is valid', () => {
    const draft = new ResponseDraft()
    draft.defence = new Defence('I did not do it')

    expect(YourDefenceTask.isCompleted(draft)).to.be.true
  })
})
