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
    describe('isSplitNameAvailable', () => {
      it('should return firstName for Individual when firstName provided', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'individual',
          name: undefined,
          title: 'testTitle',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          address: undefined,
          email: undefined
        })
        expect(theirDetails.firstName).to.equal('testFirstName')
      })

      it('should return lastName for Individual when lastName provided', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'individual',
          name: undefined,
          title: 'testTitle',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          address: undefined,
          email: undefined
        })
        expect(theirDetails.lastName).to.equal('testLastName')
      })

      it('should return title for Individual when title provided', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'individual',
          name: undefined,
          title: 'testTitle',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          address: undefined,
          email: undefined
        })
        expect(theirDetails.title).to.equal('testTitle')
      })

      it('should return firstName for SoleTrader when firstName provided', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'soleTrader',
          name: undefined,
          title: 'testTitle',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          address: undefined,
          email: undefined
        })
        expect(theirDetails.firstName).to.equal('testFirstName')
      })

      it('should return lastName for SoleTrader when lastName provided', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'soleTrader',
          name: undefined,
          title: 'testTitle',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          address: undefined,
          email: undefined
        })
        expect(theirDetails.lastName).to.equal('testLastName')
      })

      it('should return title for SoleTrader when title provided', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'soleTrader',
          name: undefined,
          title: 'testTitle',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          address: undefined,
          email: undefined
        })
        expect(theirDetails.title).to.equal('testTitle')
      })

      it('should return correspondence address', () => {
        const theirDetails = new TheirDetails().deserialize({
          type: 'individual',
          serviceAddress: {
            line1: 'Aldgate',
            line2: 'Leman Street',
            line3: 'Floor 007',
            city: 'London',
            postcode: 'E1 8FA'
          }
        })
        expect(theirDetails.correspondenceAddress.city).to.equal('London')
        expect(theirDetails.correspondenceAddress.line1).to.equal('Aldgate')
        expect(theirDetails.correspondenceAddress.line2).to.equal('Leman Street')
        expect(theirDetails.correspondenceAddress.postcode).to.equal('E1 8FA')
      })

    })
  })
})
