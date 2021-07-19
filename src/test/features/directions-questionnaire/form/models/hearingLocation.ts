/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { HearingLocation, ValidationErrors } from 'directions-questionnaire/forms/models/hearingLocation'
import { YesNoOption } from 'models/yesNoOption'

describe('HearingLocation', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const hearingLocation: HearingLocation = new HearingLocation()
      expect(hearingLocation.courtName).to.be.undefined
      expect(hearingLocation.courtPostcode).to.be.undefined
      expect(hearingLocation.courtAccepted).to.be.undefined
      expect(hearingLocation.alternativeOption).to.be.undefined
      expect(hearingLocation.alternativeCourtName).to.be.undefined
      expect(hearingLocation.alternativePostcode).to.be.undefined
      expect(hearingLocation.alternativeCourtSelected).to.be.undefined
      expect(hearingLocation.searchParam).to.be.undefined
      expect(hearingLocation.searchLoop).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when null', () => {
      const errors = validator.validateSync(new HearingLocation(null, null, null, null, null, null, null, null, null, null, null, null))

      expect(errors).to.not.be.empty
    })

    context('When a court name is present', () => {
      it('Should accept when the court accepted is yes', () => {
        let hearingLocation: HearingLocation = new HearingLocation()
        hearingLocation.courtName = 'COURT'
        hearingLocation.courtAccepted = YesNoOption.YES
        const errors = validator.validateSync(hearingLocation)

        expect(errors).to.be.empty
      })

      it('Should accept when the alternative court selected', () => {
        let hearingLocation: HearingLocation = new HearingLocation()
        hearingLocation.courtName = 'COURT'
        hearingLocation.alternativeCourtSelected = 'COURT'
        const errors = validator.validateSync(hearingLocation)

        expect(errors).to.be.empty
      })

      context('When court accepted is no', () => {
        it('Should reject when no alternative option is selected', () => {
          let hearingLocation: HearingLocation = new HearingLocation()
          hearingLocation.courtName = 'COURT'
          hearingLocation.courtAccepted = YesNoOption.NO
          const errors = validator.validateSync(hearingLocation)

          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.SELECT_ALTERNATIVE_OPTION)
        })

        context('When alternative option is courtname', () => {
          it('Should reject when alternative court name is empty', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.courtAccepted = YesNoOption.NO
            hearingLocation.alternativeOption = 'name'
            const errors = validator.validateSync(hearingLocation)

            expect(errors).to.not.be.empty
            expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_COURT_NAME)
          })

          it('Should accept when valid alternative court name is not empty', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.courtAccepted = YesNoOption.NO
            hearingLocation.alternativeOption = 'name'
            hearingLocation.alternativeCourtName = 'Court'
            const errors = validator.validateSync(hearingLocation)

            expect(errors).to.be.empty
          })
        })

        context('When alternative option is postcode', () => {
          it('Should reject when alternative postcode is empty', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.courtAccepted = YesNoOption.NO
            hearingLocation.alternativeOption = 'postcode'
            const errors = validator.validateSync(hearingLocation)

            expect(errors).to.not.be.empty
            expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_POSTCODE)
          })

          it('Should reject when alternative postcode is not a valid postcode', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.courtAccepted = undefined
            hearingLocation.alternativeOption = 'postcode'
            hearingLocation.alternativePostcode = 'not a valid postcode'

            const errors = validator.validateSync(hearingLocation)
            expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_POSTCODE)
          })

          it('Should accept when alternative postcode is not empty and a valid postcode', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.courtAccepted = YesNoOption.NO
            hearingLocation.alternativeOption = 'postcode'
            hearingLocation.alternativePostcode = 'A111AA'

            const errors = validator.validateSync(hearingLocation)
            expect(errors).to.be.empty
          })
        })
      })

      context('When alternate court selected is no', () => {
        it('Should reject when no alternative option is provided', () => {
          let hearingLocation: HearingLocation = new HearingLocation()
          hearingLocation.alternativeCourtSelected = 'no'
          hearingLocation.alternativeOption = 'name'
          const errors = validator.validateSync(hearingLocation)

          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_COURT_NAME)
        })

        context('When alternative court selected is courtname', () => {
          it('Should reject when alternative court name is empty', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.alternativeCourtSelected = 'no'
            hearingLocation.alternativeOption = 'name'
            const errors = validator.validateSync(hearingLocation)

            expect(errors).to.not.be.empty
            expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_COURT_NAME)
          })

          it('Should accept when alternative court name is not empty', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.alternativeCourtSelected = 'no'
            hearingLocation.alternativeOption = 'name'
            hearingLocation.alternativeCourtName = 'Court'
            const errors = validator.validateSync(hearingLocation)

            expect(errors).to.be.empty
          })
        })

        context('When alternative court selected option is postcode', () => {
          it('Should reject when alternative postcode is empty', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.alternativeCourtSelected = 'no'
            hearingLocation.alternativeOption = 'postcode'
            const errors = validator.validateSync(hearingLocation)

            expect(errors).to.not.be.empty
            expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_POSTCODE)
          })

          it('Should reject when alternative postcode is not a valid postcode', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.alternativeCourtSelected = 'no'
            hearingLocation.alternativeOption = 'postcode'
            hearingLocation.alternativePostcode = 'not a valid postcode'

            const errors = validator.validateSync(hearingLocation)
            expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_POSTCODE)
          })

          it('Should accept when alternative postcode is not empty and a valid postcode', () => {
            let hearingLocation: HearingLocation = new HearingLocation()
            hearingLocation.courtName = 'COURT'
            hearingLocation.alternativeCourtSelected = 'no'
            hearingLocation.alternativeOption = 'postcode'
            hearingLocation.alternativePostcode = 'A111AA'

            const errors = validator.validateSync(hearingLocation)
            expect(errors).to.be.empty
          })
        })
      })
    })

    context('When no court name is provided (alternative court is selected)', () => {
      it('Should reject when alternative court name is undefined', () => {
        let hearingLocation: HearingLocation = new HearingLocation()
        hearingLocation.courtAccepted = YesNoOption.YES
        hearingLocation.alternativeCourtSelected = 'no'
        hearingLocation.alternativeOption = 'name'
        hearingLocation.alternativeCourtName = undefined
        const errors = validator.validateSync(hearingLocation)

        expect(errors).to.not.be.empty
        expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_COURT_NAME)
      })

      it('Should reject when alternative court name is empty', () => {
        let hearingLocation: HearingLocation = new HearingLocation()
        hearingLocation.courtAccepted = YesNoOption.YES
        hearingLocation.alternativeCourtSelected = 'no'
        hearingLocation.alternativeOption = 'name'
        hearingLocation.alternativeCourtName = ''
        const errors = validator.validateSync(hearingLocation)

        expect(errors).to.not.be.empty
        expectValidationError(errors, ValidationErrors.NO_ALTERNATIVE_COURT_NAME)
      })

      it('Should accept when alternative court name is provided', () => {
        let hearingLocation: HearingLocation = new HearingLocation()
        hearingLocation.alternativeCourtName = 'court'
        hearingLocation.alternativeCourtSelected = 'no'
        const errors = validator.validateSync(hearingLocation)

        expect(errors).to.be.empty
      })
    })
  })
})
