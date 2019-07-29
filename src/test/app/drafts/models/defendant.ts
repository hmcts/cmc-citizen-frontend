import { expect } from 'chai'
import { Defendant } from 'drafts/models/defendant'

/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

describe('Defendant', () => {

  describe('constructor', () => {

    it('should have undefined email', () => {
      const defendant = new Defendant()
      expect(defendant.email).to.be.undefined
    })

    it('should have undefined party details field', () => {
      const defendant = new Defendant()
      expect(defendant.partyDetails).to.be.undefined
    })
  })

  describe('deserialize', () => {

    it('should return a Defendant instance initialised with defaults for undefined', () => {
      expect(new Defendant().deserialize(undefined)).to.eql(new Defendant())
    })

    it('should a Defendant instance initialised with defaults for null', () => {
      expect(new Defendant().deserialize(null)).to.eql(new Defendant())
    })

    it('should try to extract from old mobile field if new phone field is undefined', () => {
      const num = '07123456789'
      const actual = new Defendant().deserialize({ mobilePhone: { number: num } })
      expect(actual.phone.number).to.equal(num)
    })
  })

  describe('task state', () => {

    const defendant: object = {
      partyDetails: {
        type: 'individual',
        firstName: 'John',
        lastName: 'Smith',
        address: {
          line1: 'Flat 101',
          line2: '',
          line3: '',
          city: 'London',
          postcode: 'E10AA'
        },
        hasCorrespondenceAddress: false
      },
      phone: {
        number: '07000000000'
      }
    }

    context('is incomplete', () => {

      it('when email is defined and invalid', () => {
        const state = new Defendant().deserialize({ ...defendant, email: { address: 'some-text' } })
        expect(state.isCompleted()).to.be.false
      })

      it('when email is undefined', () => {
        const state = new Defendant().deserialize({ ...defendant, email: undefined })
        expect(state.isCompleted()).to.be.false
      })
    })

    context('is complete', () => {

      it('when email is defined and valid', () => {
        const state = new Defendant().deserialize({ ...defendant, email: { address: 'user@example.com' } })
        expect(state.isCompleted()).to.be.true
      })
    })
  })
})
