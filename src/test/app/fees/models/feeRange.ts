/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { FeeRange } from 'fees/models/feeRange'
import { CurrentVersion } from 'fees/models/currentVersion'
import { FlatAmount } from 'fees/models/flatAmount'
describe('FeeRange', () => {
  describe('#copy', () => {
    const source: FeeRange = new FeeRange(100, 3000, new CurrentVersion('version', 'description', 'status', new FlatAmount(25)))

    it('should throw an error when overrides object is undefined', () => {
      expect(() => source.copy(undefined)).to.throw(Error, 'Overrides object is required')
    })

    it('should override all properties with new values', () => {
      const overrides: Partial<FeeRange> = {
        minRange: 200,
        maxRange: 4000,
        currentVersion: {
          version: '1.0',
          description: 'Sample fee',
          status: 'approved',
          flatAmount: {
            amount: 1000
          }
        }
      }
      const range: FeeRange = source.copy(overrides)
      expect(range.minRange).to.be.equal(overrides.minRange)
      expect(range.maxRange).to.be.equal(overrides.maxRange)
      expect(range.currentVersion).to.be.instanceof(CurrentVersion)
      expect(range.currentVersion.version).to.be.equal(overrides.currentVersion.version)
      expect(range.currentVersion.description).to.be.equal(overrides.currentVersion.description)
      expect(range.currentVersion.status).to.be.equal(overrides.currentVersion.status)
      expect(range.currentVersion.flatAmount.amount).to.be.equal(overrides.currentVersion.flatAmount.amount)
    })

    it('should remove all properties if values are undefined', () => {
      const overrides: Partial<FeeRange> = {
        minRange: undefined,
        maxRange: undefined,
        currentVersion: undefined
      }

      const range: FeeRange = source.copy(overrides)
      expect(range.minRange).to.be.undefined
      expect(range.maxRange).to.be.undefined
      expect(range.currentVersion).to.be.undefined
    })
  })
})
