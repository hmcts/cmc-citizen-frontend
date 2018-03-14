/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { isCCBCCaseReference } from 'common/utils/isCCBCCaseReference'

describe('isCCBCCaseReference', () => {
  it('should return true if it is a ccbc identifier', () => {
    const referenceNumber = 'AA131231'
    expect(isCCBCCaseReference(referenceNumber)).to.be.true
  })

  it('should return true when ccbc identifier is contained but not at the start', () => {
    const referenceNumber = '111AA1'
    expect(isCCBCCaseReference(referenceNumber)).to.be.true
  })

  it('should return false when ccbc identifier doesn’t match', () => {
    const referenceNumber = '000MC001'
    expect(isCCBCCaseReference(referenceNumber)).to.be.false
  })
  it('should return false for empty reference', () => {
    const referenceNumber = ''
    expect(isCCBCCaseReference(referenceNumber)).to.be.false
  })
  it('should return false for undefined reference', () => {
    const referenceNumber = undefined
    expect(isCCBCCaseReference(referenceNumber)).to.be.false
  })
})
