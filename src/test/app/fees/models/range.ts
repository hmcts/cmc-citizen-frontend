/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { Range } from 'app/fees/models/range'
import { Fee } from 'app/fees/models/fee'

describe('Range', () => {
  describe('#copy', () => {
    const source: Range = new Range(100, 3000, new Fee('Sample', 'Sample fee', 1000, 'fixed'))

    it('should throw an error when overrides object is undefined', () => {
      expect(() => source.copy(undefined)).to.throw(Error, 'Overrides object is required')
    })

    it('should override all properties with new values', () => {
      const overrides: Partial<Range> = {
        from: 200,
        to: 4000,
        fee: {
          code: 'Sample',
          description: 'Sample fee',
          amount: 1000,
          type: 'fixed'
        }
      }

      const range: Range = source.copy(overrides)
      expect(range.from).to.be.equal(overrides.from)
      expect(range.to).to.be.equal(overrides.to)
      expect(range.fee).to.be.instanceof(Fee)
      expect(range.fee.code).to.be.equal(overrides.fee.code)
      expect(range.fee.description).to.be.equal(overrides.fee.description)
      expect(range.fee.amount).to.be.equal(overrides.fee.amount)
      expect(range.fee.type).to.be.equal(overrides.fee.type)
    })

    it('should remove all properties if values are undefined', () => {
      const overrides: Partial<Range> = {
        from: undefined,
        to: undefined,
        fee: undefined
      }

      const range: Range = source.copy(overrides)
      expect(range.from).to.be.undefined
      expect(range.to).to.be.undefined
      expect(range.fee).to.be.undefined
    })
  })
})
