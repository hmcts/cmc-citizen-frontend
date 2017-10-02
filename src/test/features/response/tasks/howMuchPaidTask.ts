import { expect } from 'chai'
import { ResponseDraft } from 'response/draft/responseDraft'
import { HowMuchPaidTask } from 'response/tasks/howMuchPaidTask'
import { LocalDate } from 'forms/models/localDate'

describe('How much owed task', () => {
  it('should be true when amount and text is defined', () => {
    const input = {
      howMuchIsPaid: {
        amount: 300,
        date : new LocalDate(20, 1, 12),
        text: 'I owe nothing'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(HowMuchPaidTask.isCompleted(responseDraft)).to.equal(true)
  })

  it('should be false when text is empty', () => {
    const input = {
      howMuchIsPaid: {
        amount: 300,
        date : new LocalDate(2007, 1, 12),
        text: undefined
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(HowMuchPaidTask.isCompleted(responseDraft)).to.equal(undefined)
  })

  it('should be undefined when amount is undefined', () => {
    const input = {
      howMuchIsPaid: {
        amount: undefined,
        date: {
          day: 10,
          month: 11,
          year: 1990
        },
        text: ''
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    console.log(HowMuchPaidTask.isCompleted(responseDraft))
    expect(HowMuchPaidTask.isCompleted(responseDraft)).to.equal(undefined)
  })

  it('should be undefined when amount is undefined and text is empty', () => {
    const input = {
      howMuchIsPaid: {
        amount: 300,
        date: {
          day: 10,
          month: 11,
          year: 10
        },
        text: 'I do not owe all money'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(HowMuchPaidTask.isCompleted(responseDraft)).to.equal(true)
  })
})
