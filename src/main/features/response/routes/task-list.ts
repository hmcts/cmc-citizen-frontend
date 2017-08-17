import * as express from 'express'
import { Moment } from 'moment'

import { Paths } from 'response/paths'

import { MomentFactory } from 'common/momentFactory'

import TaskList from 'drafts/tasks/taskList'
import TaskListItem from 'drafts/tasks/taskListItem'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'

import { ResponseDraft } from 'response/draft/responseDraft'
import { OweMoneyTask } from 'response/tasks/oweMoneyTask'

import { YourDefenceTask } from 'response/tasks/yourDefenceTask'
import { MoreTimeNeededTask } from 'response/tasks/moreTimeNeededTask'
import { YourDetails } from 'response/tasks/yourDetails'
import User from 'app/idam/user'

export function buildBeforeYouStartSection (responseDraft: ResponseDraft): TaskList {
  const tasks: TaskListItem[] = []
  tasks.push(new TaskListItem('Confirm your details', Paths.defendantYourDetailsPage.uri, YourDetails.isCompleted(responseDraft)))

  return new TaskList(1, 'Before you start', tasks)
}

export function buildRespondToClaimSection (draft: ResponseDraft, responseDeadline: Moment): TaskList {
  const tasks: TaskListItem[] = []
  const now: Moment = MomentFactory.currentDateTime()
  if (responseDeadline.isAfter(now)) {
    tasks.push(new TaskListItem('More time needed to respond', Paths.moreTimeRequestPage.uri,
      MoreTimeNeededTask.isCompleted(draft)))
  }

  tasks.push(new TaskListItem('Do you owe the money claimed', Paths.responseTypePage.uri,
    OweMoneyTask.isCompleted(draft)))

  if (draft.requireDefence()) {
    tasks.push(new TaskListItem('Your defence', Paths.defencePage.uri, YourDefenceTask.isCompleted(draft)))
  }

  return new TaskList(2, 'Respond to claim', tasks)
}

function buildSubmitSection (): TaskList {
  const tasks: TaskListItem[] = []
  tasks.push(new TaskListItem('Check and submit your response', Paths.checkAndSendPage.uri, false))

  return new TaskList(3, 'Submit', tasks)
}

function calculateRemainingDays (claim: Claim): number {
  return claim.responseDeadline.diff(MomentFactory.currentDate(), 'days')
}

function isAfter4pm (): boolean {
  return MomentFactory.currentDateTime().hour() > 15
}

export default express.Router()
  .get(Paths.taskListPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user: User = res.locals.user
      const claim: Claim = await ClaimStoreClient.retrieveByDefendantId(user.id)
      const responseDeadline: Moment = claim.responseDeadline
      const beforeYouStartSection = buildBeforeYouStartSection(user.responseDraft)
      const respondToClaimSection = buildRespondToClaimSection(user.responseDraft, responseDeadline)
      const submitSection = buildSubmitSection()

      res.render(Paths.taskListPage.associatedView,
        {
          beforeYouStartSection: beforeYouStartSection,
          submitSection: submitSection,
          respondToClaimSection: respondToClaimSection,
          allTasksCompleted: beforeYouStartSection.isCompleted() && respondToClaimSection.isCompleted(),
          claim: claim,
          noOfRemainingDays: calculateRemainingDays(claim),
          isAfter4pm: isAfter4pm()
        })
    } catch (err) {
      next(err)
    }
  })
