import { expect } from 'chai'
import { toNumberOrUndefined } from 'common/utils/numericUtils'

describe('toNumberOrUndefined', () => {

  context('should return undefined when', () => {

    it('undefined given', () => {
      expect(toNumberOrUndefined(undefined)).to.be.eq(undefined)
    })

    it('NaN given', () => {
      expect(toNumberOrUndefined(NaN)).to.be.eq(undefined)
    })

    it('null given', () => {
      expect(toNumberOrUndefined(null)).to.be.eq(undefined)
    })

    it('false given', () => {
      expect(toNumberOrUndefined(false)).to.be.eq(undefined)
    })

    it('empty string given', () => {
      expect(toNumberOrUndefined('')).to.be.eq(undefined)
    })

    it('blank string given', () => {
      expect(toNumberOrUndefined('    \t\n')).to.be.eq(undefined)
    })

    it('string given', () => {
      expect(toNumberOrUndefined('lalala')).to.be.eq(undefined)
    })

    it('given 1110,100', () => {
      expect(toNumberOrUndefined('1110,100')).to.be.eq(undefined)
    })

    it('given string 11,10', () => {
      expect(toNumberOrUndefined('11,10')).to.be.eq(undefined)
    })

    it('given string 1,1110,100', () => {
      expect(toNumberOrUndefined('1,1110,100')).to.be.eq(undefined)
    })

    it('given string 1,1,10,10,0', () => {
      expect(toNumberOrUndefined('1,1,10,10,0')).to.be.eq(undefined)
    })
  })

  context('should return number when', () => {

    it('0 given', () => {
      expect(toNumberOrUndefined(0)).to.be.eq(0)
    })

    it('"0" given', () => {
      expect(toNumberOrUndefined('0')).to.be.eq(0)
    })

    it('negative number given', () => {
      expect(toNumberOrUndefined(-10)).to.be.eq(-10)
    })

    it('negative numeric string given', () => {
      expect(toNumberOrUndefined('-10')).to.be.eq(-10)
    })

    it('positive number given', () => {
      expect(toNumberOrUndefined(10)).to.be.eq(10)
    })

    it('positive numeric string given', () => {
      expect(toNumberOrUndefined('10')).to.be.eq(10)
    })

    it('decimal number given', () => {
      expect(toNumberOrUndefined(10.10)).to.be.eq(10.10)
    })

    it('decimal numeric string given', () => {
      expect(toNumberOrUndefined('10.10')).to.be.eq(10.10)
    })

    it('negative decimal numeric string given', () => {
      expect(toNumberOrUndefined('-10.1098978')).to.be.eq(-10.1098978)
    })

    it('given 1,100', () => {
      expect(toNumberOrUndefined('1,100')).to.be.eq(1100)
    })

    it('given 110,100', () => {
      expect(toNumberOrUndefined('110,100')).to.be.eq(110100)
    })

    it('given 1,110,100', () => {
      expect(toNumberOrUndefined('1,110,100')).to.be.eq(1110100)
    })
  })
})
