/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Claimant } from 'drafts/models/claimant'
import { Defendant } from 'drafts/models/defendant'

function verifyDefaultValues (initialValue: any) {
  const actualDraft: DraftClaim = new DraftClaim().deserialize(initialValue)
  const expected: DraftClaim = new DraftClaim()

  expect(actualDraft.claimant).to.eql(expected.claimant)
  expect(actualDraft.amount).to.eql(expected.amount)
  expect(actualDraft.interest).to.eql(expected.interest)
  expect(actualDraft.interestDate).to.eql(expected.interestDate)
  expect(actualDraft.reason).to.eql(expected.reason)
  expect(actualDraft.readResolveDispute).to.eql(expected.readResolveDispute)
  expect(actualDraft.readCompletingClaim).to.eql(expected.readCompletingClaim)
}

describe('DraftClaim', () => {

  describe('constructor', () => {

    it('should have instance fields initialised where possible', () => {
      let draftClaim = new DraftClaim()
      expect(draftClaim.claimant).to.be.instanceof(Claimant)
      expect(draftClaim.defendant).to.be.instanceof(Defendant)
    })
  })

  describe('deserialize', () => {

    it('with undefined value should return a DraftClaim instance initialised with defaults', () => {
      verifyDefaultValues(undefined)
    })

    it('with null value should return a DraftClaim instance initialised with defaults', () => {
      verifyDefaultValues(null)
    })
  })
})
