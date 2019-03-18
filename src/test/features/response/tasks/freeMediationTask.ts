/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { ResponseFreeMediationTask } from 'response/tasks/freeMediationTask'
import { ResponseDraft } from 'response/draft/responseDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { CanWeUse } from 'mediation/form/models/CanWeUse'
import { CanWeUseCompany } from 'mediation/form/models/CanWeUseCompany'

describe('Free mediation task', () => {
  it('should not be completed when free mediation object is undefined', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = undefined

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.false
  })

  it('should not be completed when willYouTryMediation is yes and youCanOnlyUseMediation is undefined', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = undefined

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.false
  })

  it('should be completed when willYouTryMediation is no and youCanOnlyUseMediation is no', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.NO)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is yes and canWeUse is yes', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUse = new CanWeUse(FreeMediationOption.YES)

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is no', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is Yes and can we use is no and phone number is provided', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUse = new CanWeUse(FreeMediationOption.NO, '07777777777')

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })

  it('should be completed when WeCanUseCompany is yes and phone number confirmation is provided', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUseCompany = new CanWeUseCompany(FreeMediationOption.YES, '', '', '07777777777')

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })

  it('should be completed when WeCanUseCompany is no and phone number and contact person is provided', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUseCompany = new CanWeUseCompany(FreeMediationOption.YES, '07777777777', 'Mary Richards', '')

    expect(ResponseFreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
  })
})
