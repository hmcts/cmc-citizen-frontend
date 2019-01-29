/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FreeMediationTask } from 'response/tasks/freeMediationTask'
import { ResponseDraft } from 'response/draft/responseDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'

describe('Free mediation task', () => {
  it('should not be completed when free mediation object is undefined', () => {
    const draft = new ResponseDraft()
    draft.freeMediation = undefined

    expect(FreeMediationTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when free mediation option is not selected', () => {
    const draft = new ResponseDraft()
    draft.freeMediation = new FreeMediation(undefined)

    expect(FreeMediationTask.isCompleted(draft)).to.be.false
  })

  it('should be completed when free mediation option is selected', () => {
    FreeMediationOption.all().forEach(option => {
      const draft = new ResponseDraft()
      draft.freeMediation = new FreeMediation(option)

      expect(FreeMediationTask.isCompleted(draft)).to.be.true
    })
  })
})
