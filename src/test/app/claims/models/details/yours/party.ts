import { Party } from 'claims/models/details/yours/party'
import { expect } from 'chai'

describe('YourDetails', () => {
  describe('deserialize', () => {
    describe('isBusiness', () => {
      it('should return false for isBusiness when type is \'individual\'', () => {
        const theirDetails = new Party().deserialize({
          type: 'individual',
          name: undefined,
          email: undefined,
          phone: undefined
        })
        expect(theirDetails.isBusiness()).to.equal(false)
      })
      it('should return true for isBusiness when type is \'company\'', () => {
        const theirDetails = new Party().deserialize({
          type: 'company',
          name: undefined,
          email: undefined,
          phone: undefined
        })
        expect(theirDetails.isBusiness()).to.equal(true)
      })
    })
    describe('Check Properties', () => {
      it('should have title when input have title ', () => {
        const theirDetails = new Party().deserialize({
          type: 'individual',
          name: 'Mr. David Welcome',
          email: undefined,
          phone: undefined,
          title: 'Mr.',
          firstName: 'David',
          lastName: 'Welcome'
        })
        expect(theirDetails.title).to.equal('Mr.')
      })

      describe('Check Properties', () => {
        it('should have firstName when input have firstName ', () => {
          const theirDetails = new Party().deserialize({
            type: 'individual',
            name: 'Mr. David Welcome',
            email: undefined,
            phone: undefined,
            title: 'Mr.',
            firstName: 'David',
            lastName: 'Welcome'
          })
          expect(theirDetails.firstName).to.equal('David')
        })
      })

      describe('Check Properties', () => {
        it('should have lastName when input have lastName ', () => {
          const theirDetails = new Party().deserialize({
            type: 'individual',
            name: 'Mr. David Welcome',
            email: undefined,
            phone: undefined,
            title: 'Mr.',
            firstName: 'David',
            lastName: 'Welcome'
          })
          expect(theirDetails.lastName).to.equal('Welcome')
        })
      })

      describe('Check Properties', () => {
        it('should have lastName when input have lastName ', () => {
          const theirDetails = new Party().deserialize({
            type: 'individual',
            name: 'Mr. David Welcome',
            email: undefined,
            phone: undefined,
            title: 'Mr.',
            firstName: 'David',
            lastName: 'Welcome'
          })
          expect(theirDetails.lastName).to.equal('Welcome')
        })
      })

      describe('Check Properties', () => {
        it('should have email when input have email ', () => {
          const theirDetails = new Party().deserialize({
            type: 'individual',
            name: 'Mr. David Welcome',
            email: 'david@gmail.com',
            phone: undefined,
            title: 'Mr.',
            firstName: 'David',
            lastName: 'Welcome'
          })
          expect(theirDetails.email).to.equal('david@gmail.com')
        })
      })

      describe('Check Properties', () => {
        it('should have phone when input have phone ', () => {
          const theirDetails = new Party().deserialize({
            type: 'individual',
            name: 'Mr. David Welcome',
            email: undefined,
            phone: '8768768768',
            title: 'Mr.',
            firstName: 'David',
            lastName: 'Welcome'
          })
          expect(theirDetails.phone).to.equal('8768768768')
        })
      })
    })
  })
})
