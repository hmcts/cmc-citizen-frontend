import { expect } from 'chai'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

import { FeatureToggles } from 'utils/featureToggles'

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

    it('should return toggle value if finePrint toggle exists', () => {
      const expectedToggleValue: boolean = toBoolean(config.get<boolean>(`featureToggles.finePrint`))
      expect(FeatureToggles.isEnabled('finePrint')).to.equal(expectedToggleValue)
    })

    it('should throw an error if toggle does not exist', () => {
      expect(() => FeatureToggles.isEnabled('I am not a valid toggle name')).to.throw(Error)
    })
  })
})
