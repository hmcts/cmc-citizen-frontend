/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { TaskList } from 'drafts/tasks/taskList'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { Claim } from 'claims/models/claim'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { TaskListItem } from 'drafts/tasks/taskListItem'

describe('Claimant response task list builder', () => {
  let claim: Claim
  let claimantResponseDraft: DraftClaimantResponse

  beforeEach(() => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleDefendantResponseObj })
    claimantResponseDraft = new DraftClaimantResponse().deserialize(draftStoreServiceMock.sampleClaimantResponseDraftObj)
  })

  describe('"What the defendant said" section', () => {
    it('should be available when claimant tries to respond', () => {
      const taskList: TaskList = TaskListBuilder.buildDefendantResponseSection(claimantResponseDraft, claim)
      expect(taskList.tasks.find(task => task.name === 'View the defendant’s full response')).not.to.be.undefined
    })
  })

  describe('"How do you want to respond?" section', () => {
    it('should be available when full defence response and no free mediation', () => {
      claim.response.freeMediation = YesNoOption.NO
      const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(claimantResponseDraft, claim)
      expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).not.to.be.undefined
    })
  })

  describe('"Submit" section', () => {
    it('should be available when claimant tries to respond', () => {
      const taskList: TaskList = TaskListBuilder.buildSubmitSection(claimantResponseDraft, claimStoreServiceMock.sampleClaimObj.externalId)
      expect(taskList.tasks.find(task => task.name === 'Check and submit your response')).not.to.be.undefined
    })

    it('should list all incomplete tasks when tries to respond', () => {
      claim.response.freeMediation = YesNoOption.NO
      const taskListItems: TaskListItem[] = TaskListBuilder.buildRemainingTasks(claimantResponseDraft, claim)
      expect(taskListItems.length).not.to.be.undefined
      expect(taskListItems.length).to.be.eq(2)
    })
  })
})
