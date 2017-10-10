import { expect } from 'chai'
import { ResponseDraft } from 'response/draft/responseDraft'
import { OweMoneyTask } from 'response/tasks/oweMoneyTask'
import { ResponseType } from 'response/form/models/responseType'

describe('OweMoneyTask', () => {
  describe('when responseType OWE_NONE', () => {
    it('should be true when counterClaim is true option already paid', () => {
      const input = {
        response: {
          type: {
            value: ResponseType.OWE_NONE.value
          }
        },
        counterClaim: {
          counterClaim: true
        },
        rejectAllOfClaim: {
          option: 'alreadyPaid'
        }
      }
      const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
      expect(OweMoneyTask.isCompleted(responseDraft)).to.equal(true)
    })
  })
})

describe('when responseType equal OWE_SOME_PAID_NONE', () => {

  it('should be true when option is set', () => {
    const input = {
      response: {
        type: {
          value: ResponseType.OWE_SOME_PAID_NONE.value
        }
      },
      rejectPartOfClaim: {
        option: 'paidWhatBelievedWasOwed'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(OweMoneyTask.isCompleted(responseDraft)).to.equal(true)

  })
})

describe('when responseType equal OWE_ALL_PAID_NONE', () => {

  it('should be true when option is set ', () => {
    const input = {
      response: {
        type: {
          value: ResponseType.OWE_ALL_PAID_NONE.value
        }
      },
      rejectAllOfClaim: {
        option: 'alreadyPaid'
      },
      rejectPartOfClaim: {
        option: 'paidWhatBelievedWasOwed'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(OweMoneyTask.isCompleted(responseDraft)).to.equal(true)

  })
})

describe('when response is undefined', () => {

  it('should be false', () => {
    const input = {
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(OweMoneyTask.isCompleted(responseDraft)).to.equal(false)

  })
})
