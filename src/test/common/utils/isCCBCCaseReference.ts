/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { isCCBCCaseReference } from 'shared/utils/isCCBCCaseReference'

describe('isCCBCCaseReference', () => {
  describe('should return true when ', () => {

    it('ccbc identifier is A1QZ1234', () => {
      const referenceNumber = 'A1QZ1234'
      expect(isCCBCCaseReference(referenceNumber)).to.be.true
    })

    it('ccbc identifier is A1QZ123A', () => {
      const referenceNumber = 'A1QZ123A'
      expect(isCCBCCaseReference(referenceNumber)).to.be.true
    })

    it('ccbc identifier is A1QZ1A23', () => {
      const referenceNumber = 'A1QZ1A23'
      expect(isCCBCCaseReference(referenceNumber)).to.be.true
    })

    it('ccbc identifier is A1QZ1A2A', () => {
      const referenceNumber = 'A1QZ1A2A'
      expect(isCCBCCaseReference(referenceNumber)).to.be.true
    })

    it('ccbc identifier is A1QZ12AA', () => {
      const referenceNumber = 'A1QZ12AA'
      expect(isCCBCCaseReference(referenceNumber)).to.be.true
    })

    it('ccbc identifier is A1A11231', () => {
      const referenceNumber = 'A1A11231'
      expect(isCCBCCaseReference(referenceNumber)).to.be.true
    })

    it('ccbc identifier is contained but not at the start', () => {
      const referenceNumber = '111AA167'
      expect(isCCBCCaseReference(referenceNumber)).to.be.true
    })
  })

  describe('should return false when ', () => {

    it('ccbc identifier is AA131231', () => {
      const referenceNumber = 'AA131231'
      expect(isCCBCCaseReference(referenceNumber)).to.be.false
    })

    it('ccbc identifier is A1AAA231', () => {
      const referenceNumber = 'A1AAA231'
      expect(isCCBCCaseReference(referenceNumber)).to.be.false
    })

    it('ccbc identifier is 1QZ12345', () => {
      const referenceNumber = '1QZ12345'
      expect(isCCBCCaseReference(referenceNumber)).to.be.false
    })

    it('ccbc identifier doesn’t match', () => {
      const referenceNumber = '100MC001'
      expect(isCCBCCaseReference(referenceNumber)).to.be.false
    })

    it('ccbc identifier is PBA1C001', () => {
      const referenceNumber = 'PBA1C001'
      expect(isCCBCCaseReference(referenceNumber)).to.be.false
    })

    it('empty reference', () => {
      const referenceNumber = ''
      expect(isCCBCCaseReference(referenceNumber)).to.be.false
    })

    it('undefined reference', () => {
      const referenceNumber = undefined
      expect(isCCBCCaseReference(referenceNumber)).to.be.false
    })
  })
})
