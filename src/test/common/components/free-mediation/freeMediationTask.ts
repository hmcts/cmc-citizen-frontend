/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FreeMediationTask } from 'main/common/components/free-mediation/freeMediationTask'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { CanWeUse } from 'mediation/form/models/CanWeUse'
import { CanWeUseCompany } from 'mediation/form/models/CanWeUseCompany'

describe('Free mediation task', () => {
  it('isWillYouTryMediationCompleted should not be completed when willYouTryMediation object is undefined', () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = undefined

    expect(FreeMediationTask.isWillYouTryMediationCompleted(mediationDraft)).to.be.false
  })

  it('isWillYouTryMediationCompleted should be completed when willYouTryMediation object is ', () => {
    FreeMediationOption.all().forEach(option => {
      it(`${option}`, () => {
        const mediationDraft = new MediationDraft()
        mediationDraft.willYouTryMediation.option = option

        expect(FreeMediationTask.isWillYouTryMediationCompleted(mediationDraft)).to.be.true
      })
    })
  })

  it('isYouCanOnlyUseMediationCompleted should not be completed when youCanOnlyUseMediation object is undefined', () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = undefined

    expect(FreeMediationTask.isYouCanOnlyUseMediationCompleted(mediationDraft)).to.be.false
  })

  it('isYouCanOnlyUseMediationCompleted should be completed when youCanOnlyUseMediation object is ', () => {
    FreeMediationOption.all().forEach(option => {
      it(`${option}`, () => {
        const mediationDraft = new MediationDraft()
        mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
        mediationDraft.youCanOnlyUseMediation.option = option

        expect(FreeMediationTask.isYouCanOnlyUseMediationCompleted(mediationDraft)).to.be.true
      })
    })
  })

  it('isCanWeUseCompleted should not be completed when canWeUse and canWeUseCompany object is undefined', () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUse = undefined
    mediationDraft.canWeUseCompany = undefined

    expect(FreeMediationTask.isCanWeUseCompleted(mediationDraft)).to.be.false
  })

  it('isCanWeUseCompleted should be completed when canWeUse is set and canWeUseCompany object is undefined', () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUse = new CanWeUse(FreeMediationOption.NO, '07777777777')
    mediationDraft.canWeUseCompany = undefined

    expect(FreeMediationTask.isCanWeUseCompleted(mediationDraft)).to.be.true
  })

  it('isCanWeUseCompleted should be completed when canWeUse is undefined and canWeUseCompany object is set', () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUse = undefined
    mediationDraft.canWeUseCompany = new CanWeUseCompany(FreeMediationOption.YES, '', '', '07777777777')

    expect(FreeMediationTask.isCanWeUseCompleted(mediationDraft)).to.be.true
  })

  it('isMediationDisagreementCompleted should be completed when willYouTryMediation is no and mediationDisagreement is no', () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.NO)
    mediationDraft.mediationDisagreement = new FreeMediation(FreeMediationOption.NO)

    expect(FreeMediationTask.isMediationDisagreementCompleted(mediationDraft)).to.be.true
  })
})
