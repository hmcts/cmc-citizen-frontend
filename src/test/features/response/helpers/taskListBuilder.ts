import { expect } from 'chai'

import * as sinon from 'sinon'

import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { ResponseDraft } from 'response/draft/responseDraft'
import { TaskList } from 'drafts/tasks/taskList'
import moment = require('moment')

describe('TaskListBuilder', () => {
  let stub: sinon.SinonStub

  afterEach(() => {
    stub.restore()
  })

  describe('respond to claim section', () => {
    describe('Free mediation task', () => {
      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'requireMediation')
      })

      it('should be enabled when mediation is available', () => {
        stub.returns(true)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.contain('Free mediation')
      })

      it('should be disabled when mediation is not available', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Free mediation')
      })
    })
  })
})
