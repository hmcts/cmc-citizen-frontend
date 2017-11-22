/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'

describe('ResidenceType', () => {
  describe('all', () => {
    it('should contain expected items only', () => {
      expect(ResidenceType.all()).to.have.members([
        ResidenceType.OWN_HOME,
        ResidenceType.JOINT_OWN_HOME,
        ResidenceType.PRIVATE_RENTAL,
        ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME,
        ResidenceType.OTHER
      ])
    })
  })

  describe('valueOf', () => {
    it('should return correct values', () => {
      ResidenceType.all().forEach((element) => {
        expect(ResidenceType.valueOf(element.value).value).to.equal(element.value)
      })
    })

    it('should return undefined when given undefined as input', () => {
      expect(ResidenceType.valueOf(undefined)).to.be.undefined
    })
  })

  describe('except', () => {
    it('should throw error where no exception is provided', () => {
      expect(() => ResidenceType.except(undefined)).to.throw(Error)
    })

    it('should return all items except for the provided one', () => {
      const filtered: ResidenceType[] = ResidenceType.except(ResidenceType.OTHER)
      expect(filtered).to.contain(ResidenceType.OWN_HOME)
      expect(filtered).to.contain(ResidenceType.JOINT_OWN_HOME)
      expect(filtered).to.contain(ResidenceType.PRIVATE_RENTAL)
      expect(filtered).to.contain(ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME)
      expect(filtered).not.to.contain(ResidenceType.OTHER)
    })
  })
})
