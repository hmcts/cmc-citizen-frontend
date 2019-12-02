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
import { YesNoOption } from 'models/yesNoOption'

function mockFeatureFlag (feature: string, enabled: boolean): mock.Scope {
  return mock(`${config.get<string>('feature-toggles-api.url')}/api/ff4j/check`)
    .get(`/${feature}`)
    .reply(HttpStatus.OK, enabled ? { some: 'value' } : null)
}

const user = new User('1', 'user@example.com', 'John', 'Smith', [], 'citizen', '')
const eligibleDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize(claimDraftData), moment(), moment())
const pilotLimit = 300
const limitDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize({
  ...claimDraftData,
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: pilotLimit
      }
    ]
  },
  interest: {
    option: YesNoOption.NO
  }
}), moment(), moment())

const dqLimit = 1000

const draftWithDQOnlineLimit = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize({
  ...claimDraftData,
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: dqLimit
      }
    ]
  },
  interest: {
    option: YesNoOption.NO
  }
}), moment(), moment())

const draftWithDQOnlineLimitPlusInterest = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize({
  ...claimDraftData,
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: dqLimit
      }
    ]
  }
}), moment(), moment())

const draftWithDQOnlineOverLimit = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize({
  ...claimDraftData,
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: dqLimit + 1
      }
    ]
  },
  interest: {
    option: YesNoOption.NO
  }
}), moment(), moment())

const overLimitDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize({
  ...claimDraftData,
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: pilotLimit + 1
      }
    ]
  },
  interest: {
    option: YesNoOption.NO
  }
}), moment(), moment())

const limitPlusInterestDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize({
  ...claimDraftData,
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: pilotLimit
      }
    ]
  }
}), moment(), moment())

describe('FeaturesBuilder', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    claimStoreServiceMock.resolveRetrieveUserRoles()
  })

  describe('Admissions Feature', () => {
    it('should add admissions to features if flag is set', async () => {
      mockFeatureFlag('cmc_admissions', true)
      const features = await FeaturesBuilder.features(eligibleDraft, user)
      expect(features).to.equal('admissions')
    })
  })

  describe('Directions Questionnaire Feature', () => {
    it('should add dq to features if flag is set and draft is <= 1000', async () => {
      mockFeatureFlag('cmc_directions_questionnaire', true)
      const features = await FeaturesBuilder.features(draftWithDQOnlineLimit, user)
      expect(features).to.equal('directionsQuestionnaire')
    })

    it('should add dq to features if principal amount <= 1000 but with interest is > 1000 and flag is set', async () => {
      mockFeatureFlag('cmc_directions_questionnaire', true)
      const features = await FeaturesBuilder.features(draftWithDQOnlineLimitPlusInterest, user)
      expect(features).to.equal('directionsQuestionnaire')
    })

    it('should not dd dq to features if principal amount is > 1000', async () => {
      const features = await FeaturesBuilder.features(draftWithDQOnlineOverLimit, user)
      expect(features).to.be.undefined
    })

  })

  describe('Mediation Pilot Feature', () => {
    it('should add mediation pilot to features if principal amount <= 300 and flag is set', async () => {
      mockFeatureFlag('cmc_mediation_pilot', true)
      const features = await FeaturesBuilder.features(limitDraft, user)
      expect(features).to.equal('mediationPilot')
    })

    it('should add mediation pilot to features if principal amount <= 300 but with interest is > 300 and flag is set', async () => {
      mockFeatureFlag('cmc_mediation_pilot', true)
      const features = await FeaturesBuilder.features(limitPlusInterestDraft, user)
      expect(features).to.equal('mediationPilot')
    })

    it('should not add mediation pilot to features if principal amount is > 300', async () => {
      const features = await FeaturesBuilder.features(overLimitDraft, user)
      expect(features).to.be.undefined
    })
  })

})
