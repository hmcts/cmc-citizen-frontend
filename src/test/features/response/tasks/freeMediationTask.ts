/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FreeMediationTask } from 'shared/components/free-mediation/freeMediationTask'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { CanWeUse } from 'mediation/form/models/CanWeUse'
import { CanWeUseCompany } from 'mediation/form/models/CanWeUseCompany'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from '../../../http-mocks/claim-store'

describe('Free mediation task', () => {
  const claim: Claim = new Claim().deserialize({
    ...claimStoreMock.sampleClaimObj, ...{ features: ['directionsQuestionnaire'] }
  })

  it('should not be completed when free mediation object is undefined', async () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = undefined

    expect(await FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.false
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is yes and canWeUse is yes', async () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUse = new CanWeUse(FreeMediationOption.YES)

    expect(await FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is no', async () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)

    expect(await FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true
  })

  it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is Yes and can we use is no and phone number is provided', async () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUse = new CanWeUse(FreeMediationOption.NO, '07777777777')

    expect(await FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true
  })

  it('should be completed when WeCanUseCompany is yes and phone number confirmation is provided', async () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUseCompany = new CanWeUseCompany(FreeMediationOption.YES, '', '', '07777777777')

    expect(await FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true
  })

  it('should be completed when WeCanUseCompany is no and phone number and contact person is provided', async () => {
    const mediationDraft = new MediationDraft()
    mediationDraft.willYouTryMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)
    mediationDraft.canWeUseCompany = new CanWeUseCompany(FreeMediationOption.YES, '07777777777', 'Mary Richards', '')

    expect(await FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true
  })
})
