import { expect } from 'chai'
import { FeatureToggles } from 'utils/featureToggles'

describe('FeatureToggles', () => {
  describe('isAnyEnabled', () => {
    it('should throw an error when no toggle names are provided', () => {
      expect(() => FeatureToggles.isAnyEnabled()).to.throw(Error)
    })
  })
})
