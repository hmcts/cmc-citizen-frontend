/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'
import { HowMuchHaveYouPaidTask } from 'response/tasks/howMuchHaveYouPaidTask'
import { LocalDate } from 'forms/models/localDate'
import { generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

const validLocalDate = LocalDate.fromObject({ day: 1, month: 1, year: 2010 })
const validAmount = 100
const validText = 'valid'

describe('HowMuchHaveYouPaidTask', () => {
  context('should not be completed when', () => {
    it('howMuchHaveYouPaid is undefined', () => {
      expect(HowMuchHaveYouPaidTask.isCompleted(undefined)).to.be.false
    })

    context('amount is', () => {
      it('eq 0', () => {
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(0, validLocalDate, validText))).to.be.false
      })

      it('less than 0', () => {
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(-10, validLocalDate, validText))).to.be.false
      })
    })

    context('date is', () => {
      it('in the future', () => {
        const dateInThePast = LocalDate.fromObject({ day: 10, month: 10, year: 2200 })
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(validAmount, dateInThePast, validText))).to.be.false
      })

      it('invalid', () => {
        const dateInThePast = LocalDate.fromObject({ day: 33, month: 13, year: 1990 })
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(validAmount, dateInThePast, validText))).to.be.false
      })

      it('undefined', () => {
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(validAmount, undefined, validText))).to.be.false
      })
    })

    context('text is', () => {
      it('empty', () => {
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(validAmount, validLocalDate, ''))).to.be.false
      })

      it('undefined', () => {
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(validAmount, validLocalDate, undefined))).to.be.false
      })

      it('too long', () => {
        expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(
          validAmount, validLocalDate, generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
        ))).to.be.false
      })
    })
  })

  it('should be completed when howMuchHaveYouPaid is valid', () => {
    expect(HowMuchHaveYouPaidTask.isCompleted(new HowMuchHaveYouPaid(validAmount, validLocalDate, validText))).to.be.true
  })
})
