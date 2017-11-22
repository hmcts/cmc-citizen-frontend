/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { Individual } from 'claims/models/details/theirs/individual'
import { SoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Company } from 'app/claims/models/details/theirs/company'
import { Organisation } from 'claims/models/details/theirs/organisation'

describe('StatementOfMeans', () => {
  describe('deserialize', () => {
    it('should return empty StatementOfMeans for undefined given as input', () => {
      const actual = new StatementOfMeans().deserialize(undefined)

      expect(actual).to.be.instanceof(StatementOfMeans)
      expect(actual.residence).to.be.eq(undefined)
      expect(actual.employment).to.be.eq(undefined)
      expect(actual.employers).to.be.eq(undefined)
      expect(actual.selfEmployed).to.be.eq(undefined)
    })

    it('should return populated StatementOfMeans for valid input', () => {
      const actual = new StatementOfMeans().deserialize({
        residence: {
          type: {
            value: ResidenceType.OTHER.value,
            displayValue: ResidenceType.OTHER.displayValue
          },
          housingDetails: 'Squat'
        },
        employment: {
          isCurrentlyEmployed: true,
          employed: true,
          selfEmployted: true
        },
        employers: {
          rows: [
            {
              employerName: 'Company',
              jobTitle: 'role'
            }
          ]
        },
        selfEmployed: {
          jobTitle: 'role',
          annualTurnover: 1111,
          areYouBehindOnTax: true,
          amountYouOwe: 222,
          reason: 'I did not pay'
        }
      })

      expect(actual).to.be.instanceof(StatementOfMeans)
      expect(actual.residence).to.be.instanceOf(Residence)
      expect(actual.residence.type.value).to.equal(ResidenceType.OTHER.value)
      expect(actual.employment).to.be.instanceof(Employment)
      expect(actual.employers).to.be.instanceof(Employers)
      expect(actual.selfEmployed).to.be.instanceof(SelfEmployed)
    })
  })

  describe('isApplicableFor', () => {
    it('should throw an error if undefined is provided as input', () => {
      expect(() => StatementOfMeans.isApplicableFor(undefined)).to.throw(Error)
    })

    it('should return true for individual', () => {
      expect(StatementOfMeans.isApplicableFor(new Individual())).to.be.true
    })

    it('should return true for sole trader', () => {
      expect(StatementOfMeans.isApplicableFor(new SoleTrader())).to.be.true
    })

    it('should return false for company', () => {
      expect(StatementOfMeans.isApplicableFor(new Company())).to.be.false
    })

    it('should return false for organisation', () => {
      expect(StatementOfMeans.isApplicableFor(new Organisation())).to.be.false
    })
  })
})
