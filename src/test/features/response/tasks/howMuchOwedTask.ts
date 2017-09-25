import { expect } from 'chai'
import { ResponseDraft } from 'response/draft/responseDraft'
import { HowMuchOwedTask } from 'response/tasks/howMuchOwedTask'

describe('How much owed task', () => {
  it('should be true when amount and text is defined', () => {
    const input = {
      howMuchOwed: {
        amount: 300,
        text: 'I owe nothing'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(HowMuchOwedTask.isCompleted(responseDraft)).to.equal(true)
  })

  it('should be false when text is empty', () => {
    const input = {
      howMuchOwed: {
        amount: 300,
        text: ''
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(HowMuchOwedTask.isCompleted(responseDraft)).to.equal(false)
  })

  it('should be undefined when amount is null', () => {
    const input = {
      howMuchOwed: {
        amount: null,
        text: 'I owe nothing'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(HowMuchOwedTask.isCompleted(responseDraft)).to.equal(undefined)
  })
})
