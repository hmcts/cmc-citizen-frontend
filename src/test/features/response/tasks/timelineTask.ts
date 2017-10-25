import { expect } from 'chai'
import { ResponseDraft } from 'response/draft/responseDraft'
import { TimelineTask } from 'response/tasks/timelineTask'
import { TimelineRow } from 'response/form/models/timelineRow'

describe('Timeline task', () => {
  it('should be true when timeline object exists', () => {
    const input = {
      timeline: {
        rows: [TimelineRow.fromObject({ date: 'May', description: 'OK' })]
      }
    }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(TimelineTask.isCompleted(responseDraft)).to.equal(true)
  })

  it('should be false when timeline is not defined', () => {
    const input = { timeline: undefined }
    const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
    expect(TimelineTask.isCompleted(responseDraft)).to.equal(false)
  })
})
