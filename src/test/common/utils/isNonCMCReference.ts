/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { isNonCMCReference } from 'common/utils/isNonCMCReference'

describe('isNonCMCReference', () => {
  it('should return false when the reference number is in CMC format with upper case MC', () => {
    const referenceNumber = '000MC001'
    expect(isNonCMCReference(referenceNumber)).to.be.false
  })

  it('should return false when the reference number is in CMC format with lower case mc', () => {
    const referenceNumber = '000mc001'
    expect(isNonCMCReference(referenceNumber)).to.be.false
  })

  it('should return true if it is a CCBC identifier', () => {
    const referenceNumber = 'AA131231'
    expect(isNonCMCReference(referenceNumber)).to.be.true
  })

  it('should return true when CCBC identifier is contained but not at the start', () => {
    const referenceNumber = '111AA1'
    expect(isNonCMCReference(referenceNumber)).to.be.true
  })

  it('should return true when given an arbitrary string', () => {
    const referenceNumber = 'I’m not really a reference number so definitely not a CMC reference number'
    expect(isNonCMCReference(referenceNumber)).to.be.true
  })

  it('should return true for empty reference', () => {
    const referenceNumber = ''
    expect(isNonCMCReference(referenceNumber)).to.be.true
  })

  it('should return true for whitespace reference', () => {
    const referenceNumber = '      '
    expect(isNonCMCReference(referenceNumber)).to.be.true
  })

  it('should return true for undefined reference', () => {
    const referenceNumber = undefined
    expect(isNonCMCReference(referenceNumber)).to.be.true
  })
})
