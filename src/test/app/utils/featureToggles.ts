import { expect } from 'chai'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

describe('FeatureToggles', () => {
  describe('isAnyEnabled', () => {
    it('should throw an error when no toggle names are provided', () => {
      expect(() => FeatureToggles.isAnyEnabled()).to.throw(Error)
    })

    it('should throw an error if toggle does not exist', () => {
      expect(() => FeatureToggles.isAnyEnabled('one', 'two', 'three')).to.throw(Error)
    })
  })

  describe('isEnabled', () => {
    it('should return toggle value if testingSupport toggle exists', () => {
      const expectedToggleValue: boolean = toBoolean(config.get<boolean>(`featureToggles.testingSupport`))
      expect(FeatureToggles.isEnabled('testingSupport')).to.equal(expectedToggleValue)
    })

    it('should throw an error if toggle does not exist', () => {
      expect(() => FeatureToggles.isEnabled('I am not a valid toggle name')).to.throw(Error)
    })
  })

  describe('isWarningBannerEnabled', () => {
    it('should return toggle if warningBanner toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.warningBanner`))
      const result = await featureToggles.isWarningBannerEnabled()
      expect(result).to.equal(actual)
    })
  })

  describe('isHelpWithFeesEnabled', () => {
    it('should return toggle if help with fees toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.helpWithFees`))
      const result = await featureToggles.isHelpWithFeesEnabled()
      expect(result).to.equal(actual)
    })
  })

  describe('isPcqEnabled', () => {
    it('should return toggle if help with fees toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.pcq`))
      const result = await featureToggles.isPcqEnabled()
      expect(result).to.equal(actual)
    })
  })

  describe('isSignPostingEnabled', () => {
    it('should return toggle if singPosting toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.signPostingCTSC`))
      const result = await featureToggles.isSignPostingEnabled()
      expect(result).to.equal(actual)
    })
  })

  describe('isAntennaWebChatEnabled', () => {
    it('should return toggle if Antenna web chat toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.antennawebChat`))
      const result = await featureToggles.isAntennaWebChatEnabled()
      expect(result).to.equal(actual)
    })
  })

  describe('isPaginationForDashboardEnabled', () => {
    it('should return toggle if pagination toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.dashboard_pagination_enabled`))
      const result = await featureToggles.isDashboardPaginationEnabled()
      expect(result).to.equal(actual)
    })
  })

  describe('isBreathingSpaceEnabled', () => {
    it('should return toggle if pagination toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.breathingSpace`))
      const result = await featureToggles.isBreathingSpaceEnabled()
      expect(result).to.equal(actual)
    })
  })

  describe('isNewClaimFeesEnabled', () => {
    it('should return toggle if new claim fees toggle exists', async () => {
      const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
      const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
      const actual = toBoolean(config.get<boolean>(`featureToggles.newClaimFees`))
      const result = await featureToggles.isNewClaimFeesEnabled()
      expect(result).to.equal(actual)
    })
  })
})
