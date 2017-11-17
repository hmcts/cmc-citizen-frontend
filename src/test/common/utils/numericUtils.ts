import { expect } from 'chai'
import { NumericUtils } from 'common/utils/numericUtils'

describe('NumericUtils', () => {

  describe('toNumberOrUndefined', () => {

    context('should return undefined when', () => {

      it('undefined given', () => {
        expect(NumericUtils.toNumberOrUndefined(undefined)).to.be.eq(undefined)
      })

      it('NaN given', () => {
        expect(NumericUtils.toNumberOrUndefined(NaN)).to.be.eq(undefined)
      })

      it('null given', () => {
        expect(NumericUtils.toNumberOrUndefined(null)).to.be.eq(undefined)
      })

      it('false given', () => {
        expect(NumericUtils.toNumberOrUndefined(false)).to.be.eq(undefined)
      })

      it('empty string given', () => {
        expect(NumericUtils.toNumberOrUndefined('')).to.be.eq(undefined)
      })

      it('blank string given', () => {
        expect(NumericUtils.toNumberOrUndefined('    \t\n')).to.be.eq(undefined)
      })

      it('string given', () => {
        expect(NumericUtils.toNumberOrUndefined('lalala')).to.be.eq(undefined)
      })
    })

    context('should return number when', () => {

      it('0 given', () => {
        expect(NumericUtils.toNumberOrUndefined(0)).to.be.eq(0)
      })

      it('"0" given', () => {
        expect(NumericUtils.toNumberOrUndefined('0')).to.be.eq(0)
      })

      it('negative number given', () => {
        expect(NumericUtils.toNumberOrUndefined(-10)).to.be.eq(-10)
      })

      it('negative numeric string given', () => {
        expect(NumericUtils.toNumberOrUndefined('-10')).to.be.eq(-10)
      })

      it('positive number given', () => {
        expect(NumericUtils.toNumberOrUndefined(10)).to.be.eq(10)
      })

      it('positive numeric string given', () => {
        expect(NumericUtils.toNumberOrUndefined('10')).to.be.eq(10)
      })

      it('decimal number given', () => {
        expect(NumericUtils.toNumberOrUndefined(10.10)).to.be.eq(10.10)
      })

      it('decimal numeric string given', () => {
        expect(NumericUtils.toNumberOrUndefined('10.10')).to.be.eq(10.10)
      })

      it('negative decimal numeric string given', () => {
        expect(NumericUtils.toNumberOrUndefined('-10.1098978')).to.be.eq(-10.1098978)
      })
    })
  })
})
