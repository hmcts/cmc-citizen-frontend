/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { isCMCReference } from 'shared/utils/isCMCReference'

describe('isCMCReference', () => {
  it('should return true when the reference number is in CMC format with upper case MC', () => {
    const referenceNumber = '000MC001'
    expect(isCMCReference(referenceNumber)).to.be.true
  })

  it('should return true when the reference number is in CMC format with lower case mc', () => {
    const referenceNumber = '000MC001'
    expect(isCMCReference(referenceNumber)).to.be.true
  })

  it('should return false if it is a CCBC identifier', () => {
    const referenceNumber = 'AA131231'
    expect(isCMCReference(referenceNumber)).to.be.false
  })

  it('should return false when CCBC identifier is contained but not at the start', () => {
    const referenceNumber = '111AA1'
    expect(isCMCReference(referenceNumber)).to.be.false
  })

  it('should return false when given an arbitrary string', () => {
    const referenceNumber = 'I’m not really a reference number so definitely not a CMC reference number'
    expect(isCMCReference(referenceNumber)).to.be.false
  })

  it('should return false for empty reference', () => {
    const referenceNumber = ''
    expect(isCMCReference(referenceNumber)).to.be.false
  })

  it('should return false for whitespace reference', () => {
    const referenceNumber = '      '
    expect(isCMCReference(referenceNumber)).to.be.false
  })

  it('should return false for undefined reference', () => {
    const referenceNumber = undefined
    expect(isCMCReference(referenceNumber)).to.be.false
  })
})
