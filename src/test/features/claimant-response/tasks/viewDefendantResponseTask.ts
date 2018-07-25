import { expect } from 'chai'

import { ViewDefendantResponseTask } from 'claimant-response/tasks/viewDefendantResponseTask'

describe('ViewDefendantResponseTask', () => {
  describe('isCompleted', () => {
    it('should return true when defendant response has been viewed by claimant', () => {
      expect(ViewDefendantResponseTask.isCompleted(true)).to.equal(true)
    })

    it('should return false when defendant response has not been viewed by claimant (false)', () => {
      expect(ViewDefendantResponseTask.isCompleted(false)).to.equal(false)
    })

    it('should return false when defendant response has not been viewed by claimant (undefined)', () => {
      expect(ViewDefendantResponseTask.isCompleted(undefined)).to.equal(false)
    })
  })
})
