import * as express from 'express'
import { Moment } from 'moment'

import { Paths } from 'response/paths'

import Claim from 'claims/models/claim'

import User from 'app/idam/user'
import { isAfter4pm } from 'common/dateUtils'
import { TaskListBuilder } from 'response/helpers/taskListBuilder'

export default express.Router()
  .get(Paths.taskListPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user: User = res.locals.user
      const claim: Claim = user.claim
      const responseDeadline: Moment = claim.responseDeadline
      const beforeYouStartSection = TaskListBuilder
        .buildBeforeYouStartSection(user.responseDraft.document, claim.externalId)
      const respondToClaimSection = TaskListBuilder
        .buildRespondToClaimSection(user.responseDraft.document, responseDeadline, claim.externalId)
      const submitSection = TaskListBuilder.buildSubmitSection(claim.externalId)

      res.render(Paths.taskListPage.associatedView,
        {
          beforYouStartSection: beforeYouStartSection,
          submitSection: submitSection,
          respondToClaimSection: respondToClaimSection,
          claim: claim,
          isAfter4pm: isAfter4pm()
        })
    } catch (err) {
      next(err)
    }
  })
