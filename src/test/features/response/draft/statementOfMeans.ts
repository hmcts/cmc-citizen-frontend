import { expect } from 'chai'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'

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
        residence: undefined,
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
      expect(actual.residence).to.be.instanceof(Residence)
      expect(actual.employment).to.be.instanceof(Employment)
      expect(actual.employers).to.be.instanceof(Employers)
      expect(actual.selfEmployed).to.be.instanceof(SelfEmployed)
    })
  })
})
