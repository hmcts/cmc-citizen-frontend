/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { isCCBCCasePrefix } from 'common/utils/ccbcCasePrefix'

describe('isCCBCCasePrefix', () => {
  it('should return true if it is a prefix', () => {
    const referenceNumber = 'AA131231'
    expect(isCCBCCasePrefix(referenceNumber)).to.be.true
  })

  it('should return false when prefix is contained but not at the start', () => {
    const referenceNumber = '111AA1'
    expect(isCCBCCasePrefix(referenceNumber)).to.be.false
  })

  it('should return false when prefix doesn’t match', () => {
    const referenceNumber = '000MC001'
    expect(isCCBCCasePrefix(referenceNumber)).to.be.false
  })
  it('should return false for empty reference', () => {
    const referenceNumber = ''
    expect(isCCBCCasePrefix(referenceNumber)).to.be.false
  })
  it('should return false for undefined reference', () => {
    const referenceNumber = undefined
    expect(isCCBCCasePrefix(referenceNumber)).to.be.false
  })
})
