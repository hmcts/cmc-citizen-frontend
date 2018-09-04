import { expect } from 'chai'
import { CourtOrder } from 'common/court-order/courtOrder'

describe('CourtOrder', () => {

  describe('calculateAmount', () => {
    describe('when the defendant’s instalment amount is greater than to disposable income', () => {

      describe('and the claimant’s instalment amount is greater than the defendant’s instalment amount', () => {
        it('should use the defendant’s offered amount', () => {
          expect(new CourtOrder(2000, 3000, 1500).calculateAmount()).to.equal(2000)
        })
      })

      describe('and the claimant’s instalment amount is lower than the defendant’s instalment amount', () => {
        it('should use the defendant’s offered amount', () => {
          expect(new CourtOrder(2000, 1000, 1500).calculateAmount()).to.equal(2000)
        })
      })

      describe('and the claimant’s instalment amount is equal to the defendant’s instalment amount', () => {
        it('should use the defendant’s offered amount', () => {
          expect(new CourtOrder(2000, 2000, 1500).calculateAmount()).to.equal(2000)
        })
      })
    })

    describe('when the defendant’s instalment amount is equal to disposable income', () => {

      describe('and the claimant’s instalment amount is greater than the defendant’s instalment amount', () => {
        it('should use the defendant’s offered amount', () => {
          expect(new CourtOrder(1500, 3000, 1500).calculateAmount()).to.equal(1500)
        })
      })

      describe('and the claimant’s instalment amount is lower than the defendant’s instalment amount', () => {
        it('should use the defendant’s offered amount', () => {
          expect(new CourtOrder(1500, 1000, 1500).calculateAmount()).to.equal(1500)
        })
      })

      describe('and the claimant’s instalment amount is equal to the defendant’s instalment amount', () => {
        it('should use the defendant’s offered amount', () => {
          expect(new CourtOrder(1500, 1500, 1500).calculateAmount()).to.equal(1500)
        })
      })
    })

    describe('when the defendant’s instalment amount is lower than disposable income', () => {

      describe('and the claimant’s instalment amount is greater than than disposable income', () => {
        it('should use the disposable income amount', () => {
          expect(new CourtOrder(1000, 3000, 1500).calculateAmount()).to.equal(1500)
        })
      })

      describe('and the claimant’s instalment amount is lower than than disposable income', () => {
        it('should use the claimant’s offered amount', () => {
          expect(new CourtOrder(1000, 1300, 1500).calculateAmount()).to.equal(1300)
        })
      })

      describe('and the claimant’s instalment amount is equal to disposable income', () => {
        it('should use the claimant’s offered amount', () => {
          expect(new CourtOrder(1000, 1500, 1500).calculateAmount()).to.equal(1500)
        })
      })
    })
  })
})
