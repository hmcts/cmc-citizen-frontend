/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

describe('ExpertRequired', () => {
  context('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new WhyExpertIsNeeded().deserialize(undefined)).to.deep.equal(new WhyExpertIsNeeded())
    })

  })
})

describe('from object', () => {
  it('should return instance of why evidence is needed when passed WhyExpertIsNeeded object', () => {
    const whyExpertIsNeeded: string = 'example input'
    expect(WhyExpertIsNeeded.fromObject({ whyExpertIsNeeded })).to.be.instanceOf(WhyExpertIsNeeded)
  })
})
