import * as express from 'express'
import { Moment } from 'moment'

import { Paths } from 'response/paths'

import { MomentFactory } from 'common/momentFactory'

import TaskList from 'drafts/tasks/taskList'
import TaskListItem from 'drafts/tasks/taskListItem'

import Claim from 'claims/models/claim'

import { ResponseDraft } from 'response/draft/responseDraft'
import { OfferDraft } from 'response/draft/offerDraft'
import { OweMoneyTask } from 'response/tasks/oweMoneyTask'

import { YourDefenceTask } from 'response/tasks/yourDefenceTask'
import { YourOfferTask } from 'response/tasks/yourOfferTask'
import { MoreTimeNeededTask } from 'response/tasks/moreTimeNeededTask'
import { YourDetails } from 'response/tasks/yourDetails'
import User from 'app/idam/user'
import { isAfter4pm } from 'common/dateUtils'

export function buildBeforeYouStartSection (responseDraft: ResponseDraft, externalId: string): TaskList {
  const tasks: TaskListItem[] = []
  tasks.push(new TaskListItem('Confirm your details', Paths.defendantYourDetailsPage
    .evaluateUri({ externalId: externalId }), YourDetails.isCompleted(responseDraft)))

  return new TaskList(1, 'Before you start', tasks)
}

export function buildRespondToClaimSection (user: User, responseDeadline: Moment, externalId: string): TaskList {
  const tasks: TaskListItem[] = []
  const now: Moment = MomentFactory.currentDateTime()
  const draft: ResponseDraft = user.responseDraft
  const offerDraft: OfferDraft = user.offerDraft
  if (responseDeadline.isAfter(now)) {
    tasks.push(new TaskListItem('More time needed to respond', Paths.moreTimeRequestPage
        .evaluateUri({ externalId: externalId }),
      MoreTimeNeededTask.isCompleted(draft)))
  }

  tasks.push(new TaskListItem('Do you owe the money claimed', Paths.responseTypePage
      .evaluateUri({ externalId: externalId }),
    OweMoneyTask.isCompleted(draft)))

  if (draft.requireDefence()) {
    tasks.push(new TaskListItem('Your defence', Paths.defencePage
        .evaluateUri({ externalId: externalId }),
      YourDefenceTask.isCompleted(draft)))
  }

  if (draft.canMakeOffer()) {
    tasks.push(new TaskListItem('Make an offer to settle out of court', Paths.settleOutOfCourtPage
        .evaluateUri({ externalId: externalId }),
        YourOfferTask.isCompleted(offerDraft)))
  }

  return new TaskList(2, 'Respond to claim', tasks)
}

function buildSubmitSection (externalId: string): TaskList {
  const tasks: TaskListItem[] = []
  tasks.push(new TaskListItem('Check and submit your response', Paths.checkAndSendPage
    .evaluateUri({ externalId: externalId }), false))

  return new TaskList(3, 'Submit', tasks)
}

export default express.Router()
  .get(Paths.taskListPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user: User = res.locals.user
      const claim: Claim = user.claim
      const responseDeadline: Moment = claim.responseDeadline
      const beforeYouStartSection = buildBeforeYouStartSection(user.responseDraft, claim.externalId)
      const respondToClaimSection = buildRespondToClaimSection(user, responseDeadline, claim.externalId)
      const submitSection = buildSubmitSection(claim.externalId)

      res.render(Paths.taskListPage.associatedView,
        {
          beforeYouStartSection: beforeYouStartSection,
          submitSection: submitSection,
          respondToClaimSection: respondToClaimSection,
          allTasksCompleted: beforeYouStartSection.isCompleted() && respondToClaimSection.isCompleted(),
          claim: claim,
          isAfter4pm: isAfter4pm()
        })
    } catch (err) {
      next(err)
    }
  })
