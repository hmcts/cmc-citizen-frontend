/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FreeMediationTask } from 'response/tasks/freeMediationTask'
import { ResponseDraft } from 'response/draft/responseDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { MediationDraft } from 'mediation/draft/mediationDraft'

describe('Free mediation task', () => {
  it('should not be completed when free mediation object is undefined', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouOptOutOfMediation = undefined

    expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.false
  })

  it('should not be completed when willYouTryMediation is yes and youCanOnlyUseMediation is undefined', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouOptOutOfMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = undefined

    expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.false
  })

  it('should be completed when willYouTryMediation is no and youCanOnlyUseMediation is undefined', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouOptOutOfMediation = new FreeMediation(FreeMediationOption.NO)
    mediationDraft.youCanOnlyUseMediation = undefined

    expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is yes', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouOptOutOfMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)

    expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is no', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouOptOutOfMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)

    expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })
})
