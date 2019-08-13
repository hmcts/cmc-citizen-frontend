/* tslint:disable:no-unused-expression */
import { ExpertReports, ValidationErrors } from 'directions-questionnaire/forms/models/expertReports'
import { expect } from 'chai'
import { ReportRow, ValidationErrors as NestedValidationErrors } from 'directions-questionnaire/forms/models/reportRow'
import { LocalDate } from 'forms/models/localDate'
import { MomentFactory } from 'shared/momentFactory'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

describe('Expert Reports', () => {
  context('constructor', () => {
    const fiveDaysAgo: LocalDate = LocalDate.fromMoment(MomentFactory.currentDate().subtract(5, 'days'))

    it('should use defaults when no parameters given', () => {
      const reports: ExpertReports = new ExpertReports()
      expect(reports.declared).to.be.undefined

      expect(reports.rows).to.have.length(1)
      expect(reports.rows[0].expertName).to.be.undefined
      expect(reports.rows[0].reportDate).to.be.undefined
    })

    it('should use provided parameters', () => {
      const reports: ExpertReports = new ExpertReports(
        YesNoOption.YES,
        [new ReportRow('Mr Blobby', fiveDaysAgo)]
      )
      expect(reports.declared).to.equal(YesNoOption.YES)

      expect(reports.rows).to.have.length(1)
      expect(reports.rows[0].expertName).to.equal('Mr Blobby')
      expect(reports.rows[0].reportDate).to.deep.equal(fiveDaysAgo)
    })
  })

  context('from form object', () => {
    it('returns same falsy value', () => {
      expect(ExpertReports.fromObject(undefined)).to.be.undefined
      expect(ExpertReports.fromObject(null)).to.be.null
    })

    it('returns expected values', () => {
      const reports: ExpertReports = ExpertReports.fromObject({
        declared: YesNoOption.YES.option,
        rows: [{ expertName: 'Mr Blobby', reportDate: { year: 2018, month: 4, day: 13 } }]
      })

      expect(reports.declared).to.equal(YesNoOption.YES)
      expect(reports.rows).to.have.length(1)
      expect(reports.rows[0].expertName).to.equal('Mr Blobby')
      expect(reports.rows[0].reportDate).to.deep.equal({ year: 2018, month: 4, day: 13 })
    })
  })

  context('deserialize', () => {
    it('should return unchanged object when deserializing falsy', () => {
      const reports: ExpertReports = new ExpertReports()
      expect(reports.deserialize(undefined)).to.deep.equal(reports)
      expect(reports.deserialize(null)).to.deep.equal(reports)
    })

    it('should deserialize false sensibly', () => {
      const reports: ExpertReports = new ExpertReports().deserialize({
        declared: YesNoOption.NO.option
      })
      expect(reports.declared).to.equal(YesNoOption.NO.option)
      expect(reports.rows).to.be.empty
    })

    it('should deserialize populated values sensibly', () => {
      const reports: ExpertReports = new ExpertReports().deserialize({
        declared: YesNoOption.YES.option,
        rows: [{ expertName: 'Stephen Hawking', reportDate: { year: 2018, month: 3, day: 14 } }]
      })
      expect(reports.declared).to.equal(YesNoOption.YES.option)
      expect(reports.rows).to.have.length(1)
      expect(reports.rows[0].expertName).to.equal('Stephen Hawking')
      expect(reports.rows[0].reportDate).to.deep.equal({ year: 2018, month: 3, day: 14 })
    })
  })

  context('validation', () => {
    const validator: Validator = new Validator()

    it('should reject null', () => {
      const errors = validator.validateSync(new ExpertReports(null, null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject without declaration', () => {
      const errors = validator.validateSync(new ExpertReports())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject when reports declared but none provided', () => {
      const errors = validator.validateSync(new ExpertReports(YesNoOption.YES))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE_ROW)
    })

    it('should reject a report with a future date', () => {
      const errors = validator.validateSync(new ExpertReports(YesNoOption.YES, [
        new ReportRow('A', LocalDate.fromMoment(MomentFactory.currentDate().add(1, 'day')))
      ]))

      expect(errors).to.not.be.empty
      expectValidationError(errors, NestedValidationErrors.PAST_DATE_REQUIRED)
    })

    it('should accept affirmed reports with valid data', () => {
      const errors = validator.validateSync(new ExpertReports(YesNoOption.YES, [
        new ReportRow('B', LocalDate.fromMoment(MomentFactory.currentDate().subtract(1, 'day')))
      ]))

      expect(errors).to.be.empty
    })

    it('should accept declined reports', () => {
      const errors = validator.validateSync(new ExpertReports(YesNoOption.NO, []))

      expect(errors).to.be.empty
    })
  })
})
