/* tslint:disable:no-unused-expression */
import { ReportRow, ValidationErrors } from 'directions-questionnaire/forms/models/reportRow'
import { ValidationErrors as DateValidationErrors } from 'main/app/forms/models/localDate'
import { expect } from 'chai'
import { MomentFactory } from 'shared/momentFactory'
import { LocalDate } from 'forms/models/localDate'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

describe('Report Rows', () => {
  context('constructor', () => {
    it('should use defaults when no parameters', () => {
      const row: ReportRow = new ReportRow()
      expect(row.expertName).to.be.undefined
      expect(row.reportDate).to.be.undefined
    })

    it('should use provided values', () => {
      const tenDaysAgo = LocalDate.fromMoment(MomentFactory.currentDate().subtract(10, 'days'))
      const row: ReportRow = new ReportRow('John Doe', tenDaysAgo)

      expect(row.expertName).to.equal('John Doe')
      expect(row.reportDate).to.deep.equal(tenDaysAgo)
    })
  })

  context('empty', () => {
    it('should return an empty row', () => {
      const row: ReportRow = ReportRow.empty()
      expect(row.expertName).to.be.undefined
      expect(row.reportDate).to.be.undefined
    })
  })

  context('from form object', () => {
    it('returns same falsy value', () => {
      expect(ReportRow.fromObject(undefined)).to.be.undefined
      expect(ReportRow.fromObject(null)).to.be.null
    })

    it('returns expected values', () => {
      const row: ReportRow = ReportRow.fromObject({
        expertName: 'John Doe',
        reportDate: { year: 2018, month: 12, day: 25 }
      })

      expect(row.expertName).to.equal('John Doe')
      expect(row.reportDate).to.deep.equal({ year: 2018, month: 12, day: 25 })
    })
  })

  context('deserialize', () => {
    it('should return unchanged object when deserializing falsy', () => {
      const row: ReportRow = new ReportRow()
      expect(row.deserialize(undefined)).to.deep.equal(row)
      expect(row.deserialize(null)).to.deep.equal(row)
    })

    it('should deserialize values sensibly', () => {
      const row: ReportRow = new ReportRow().deserialize({
        expertName: 'John Doe',
        reportDate: { year: 2018, month: 12, day: 25 }
      })

      expect(row.expertName).to.equal('John Doe')
      expect(row.reportDate).to.deep.equal({ year: 2018, month: 12, day: 25 })
    })
  })

  context('validation', () => {
    const validator: Validator = new Validator()

    it('should accept all falsy values', () => {
      const errors = validator.validateSync(new ReportRow())

      expect(errors).to.be.empty
    })

    it('should reject missing name when date is provided', () => {
      const errors = validator.validateSync(new ReportRow(
        undefined,
        LocalDate.fromMoment(MomentFactory.currentDate())
      ))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.NAME_REQUIRED)
    })

    it('should reject missing date when name is provided', () => {
      const errors = validator.validateSync(new ReportRow(
        'Frank Moses',
        undefined
      ))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
    })

    it('should reject future date', () => {
      const errors = validator.validateSync(new ReportRow(
        'Marvin Boggs',
        LocalDate.fromMoment(MomentFactory.currentDate().add(1, 'day'))
      ))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.PAST_DATE_REQUIRED)
    })

    it('should reject invalid date', () => {
      const errors = validator.validateSync(new ReportRow(
        'William Cooper',
        LocalDate.fromObject({ year: 2019, month: 2, day: 30 })
      ))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.VALID_DATE_REQUIRED)
    })

    it('should reject incomplete date', () => {
      const errors = validator.validateSync(new ReportRow(
        'Sarah Ross',
        LocalDate.fromObject({ year: 2019, day: 5 })
      ))

      expect(errors).to.not.be.empty
      expectValidationError(errors, DateValidationErrors.MONTH_NOT_VALID)
    })
  })
})
