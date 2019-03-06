/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FreeMediationTask } from 'response/tasks/freeMediationTask'
import { ResponseDraft } from 'response/draft/responseDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { CanWeUse } from 'mediation/form/models/CanWeUse'
import { CanWeUseCompany } from 'mediation/form/models/CanWeUseCompany'

describe('Free mediation task', () => {
  it('should not be completed when free mediation object is undefined', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = undefined

    expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.false
  })

  it('should not be completed when willYouTryMediation is yes and youCanOnlyUseMediation is undefined', () => {
    const draft = new ResponseDraft()
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = undefined

    expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.false
  })

  if (FeatureToggles.isEnabled('mediation')) {
    it('should be completed when willYouTryMediation is no and youCanOnlyUseMediation is no', () => {
      const draft = new ResponseDraft()
      const mediationDraft = new MediationDraft()
      mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.NO)
      mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)

      expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
    })

    it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is yes and canWeUse is yes', () => {
      const draft = new ResponseDraft()
      const mediationDraft = new MediationDraft()
      mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.canWeUse = new CanWeUse(FreeMediationOption.YES)

      expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
    })

    it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is no', () => {
      const draft = new ResponseDraft()
      const mediationDraft = new MediationDraft()
      mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)

      expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
    })

    it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is Yes and can we use is no and phone number is provided', () => {
      const draft = new ResponseDraft()
      const mediationDraft = new MediationDraft()
      mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.canWeUse = new CanWeUse(FreeMediationOption.NO, '07777777777')

      expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
    })

    it('should be completed when WeCanUseCompany is yes and phone number confirmation is provided', () => {
      const draft = new ResponseDraft()
      const mediationDraft = new MediationDraft()
      mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.canWeUseCompany = new CanWeUseCompany(FreeMediationOption.YES, '', '', '07777777777')

      expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
    })

    it('should be completed when WeCanUseCompany is no and phone number and contact person is provided', () => {
      const draft = new ResponseDraft()
      const mediationDraft = new MediationDraft()
      mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
      mediationDraft.canWeUseCompany = new CanWeUseCompany(FreeMediationOption.YES, '07777777777', 'Mary Richards', '')

      expect(FreeMediationTask.isCompleted(draft, mediationDraft)).to.be.true
    })
  }
})
