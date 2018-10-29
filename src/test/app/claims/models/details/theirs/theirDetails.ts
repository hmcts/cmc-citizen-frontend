import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { expect } from 'chai'

describe('TheirData', () => {
  describe('deserialize', () => {
    describe('isBusiness', () => {
      it('should return false for isBusiness when type is \'individual\'', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'individual',
          name: undefined,
          address: undefined,
          email: undefined
        })
        expect(theirDetails.isBusiness()).to.equal(false)
      })

      it('should return false for isBusiness when type is \'soleTrader\'', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'soleTrader',
          name: undefined,
          address: undefined,
          email: undefined
        })
        expect(theirDetails.isBusiness()).to.equal(false)
      })

      it('should return true for isBusiness when type is \'company\'', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'company',
          name: undefined,
          address: undefined,
          email: undefined
        })
        expect(theirDetails.isBusiness()).to.equal(true)
      })

      it('should return true for isBusiness when type is \'organisation\'', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'organisation',
          name: undefined,
          address: undefined,
          email: undefined
        })
        expect(theirDetails.isBusiness()).to.equal(true)
      })
    })
  })
})
