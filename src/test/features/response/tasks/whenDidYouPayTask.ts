import { expect } from 'chai'
import { ResponseDraft } from 'response/draft/responseDraft'
import { WhenDidYouPayTask } from 'response/tasks/whenDidYouPayTask'
import { LocalDate } from 'forms/models/localDate'

describe('When did you pay task', () => {
  it('should be true when date and text is defined', () => {
    const input = {
      whenDidYouPay: {
        date: {
          day: 10,
          month: 11,
          year: 1990
        },
        text: 'I paid cash'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(WhenDidYouPayTask.isCompleted(responseDraft)).to.equal(true)
  })

  it('should be false when text is empty', () => {
    const input = {
      whenDidYouPay: {
        date : new LocalDate(2007, 1, 12),
        text: ''
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(WhenDidYouPayTask.isCompleted(responseDraft)).to.equal(false)
  })

  it('should be false when date is undefined', () => {
    const input = {
      whenDidYouPay: {
        date: undefined,
        text: 'I paid cash'
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(WhenDidYouPayTask.isCompleted(responseDraft)).to.equal(false)
  })
})
