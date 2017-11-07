/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { StringUtils } from 'utils/stringUtils'

describe('StringUtils', () => {
  describe('trimToUndefined', () => {
    it('should return undefined if value is undefined', () => {
      expect(StringUtils.trimToUndefined(undefined)).to.be.undefined
    })

    it('should return undefined for blank string', () => {
      expect(StringUtils.trimToUndefined('')).to.be.undefined
    })

    it('should return undefined for empty string', () => {
      expect(StringUtils.trimToUndefined('   ')).to.be.undefined
    })

    it('should return trim string if on both ends', () => {
      expect(StringUtils.trimToUndefined('  abc  ')).to.be.equal('abc')
    })

    it('should return unchanged string if there is nothing to trim', () => {
      expect(StringUtils.trimToUndefined('abc')).to.be.equal('abc')
    })
  })
})
