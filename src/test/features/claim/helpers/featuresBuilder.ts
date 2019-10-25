/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { claimDraft as claimDraftData } from 'test/data/draft/claimDraft'
import * as moment from 'moment'
import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'

function mockFeatureFlag (feature: string, enabled: boolean): mock.Scope {
  return mock(`${config.get<string>('feature-toggles-api.url')}/api/ff4j/check`)
    .get(`/${feature}`)
    .reply(HttpStatus.OK, enabled ? { some: 'value' } : null)
}

function mockInterestCalculation (amount: number = 10): mock.Scope {
  return mock(`${config.get<string>('claim-store.url')}/interest`)
    .get(`/calculate`)
    .query(true)
    .reply(HttpStatus.OK, { amount: amount })
}
const user = new User('1', 'user@example.com', 'John', 'Smith', [], 'citizen', '')
const elegibleDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize(claimDraftData), moment(), moment())

describe('FeaturesBuilder', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    claimStoreServiceMock.resolveRetrieveUserRoles()
    mockInterestCalculation()
  })
  it('should add admissions to features if flag is set', async () => {
    mockFeatureFlag('cmc_admissions', true)
    mockFeatureFlag('cmc_directions_questionnaire', false)
    const features = await FeaturesBuilder.features(elegibleDraft, user)
    expect(features).to.equal('admissions')
  })

  it('should add dq to features if flag is set and draft is <= 300', async () => {
    mockFeatureFlag('cmc_directions_questionnaire', true)
    const features = await FeaturesBuilder.features(elegibleDraft, user)
    expect(features).to.equal('directionsQuestionnaire')
  })

  it('should not dd dq to features if flag is set and draft is > 300', async () => {
    const claimDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize({
      ...claimDraftData,
      amount: {
        rows: [
          {
            reason: 'Valid reason',
            amount: 500
          }
        ]
      }
    }), moment(), moment())

    const features = await FeaturesBuilder.features(claimDraft, user)
    expect(features).to.be.undefined
  })

  it('should add mediation pilot to features if total amount <= 300 and flag is set', async () => {
    mockFeatureFlag('cmc_directions_questionnaire', false)
    mockFeatureFlag('cmc_mediation_pilot', true)
    const features = await FeaturesBuilder.features(elegibleDraft, user)
    expect(features).to.equal('mediationPilot')
  })

  it('should not add mediation pilot to features if flag is set but claim amount is > 300', async () => {
    const features = await FeaturesBuilder.features(elegibleDraft, user)
    expect(features).to.be.undefined
  })

  it('should add dq and mediation pilot to features if total amount <= 300 and flag is set', async () => {
    mockFeatureFlag('cmc_directions_questionnaire', true)
    mockFeatureFlag('cmc_mediation_pilot', true)
    const features = await FeaturesBuilder.features(elegibleDraft, user)
    expect(features).to.equal('directionsQuestionnaire, mediationPilot')
  })

  it('should add all flags', async () => {
    mockFeatureFlag('cmc_admissions', true)
    mockFeatureFlag('cmc_directions_questionnaire', true)
    mockFeatureFlag('cmc_mediation_pilot', true)
    const features = await FeaturesBuilder.features(elegibleDraft, user)
    expect(features).to.equal('admissions, directionsQuestionnaire, mediationPilot')
  })

})
