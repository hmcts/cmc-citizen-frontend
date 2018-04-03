import * as express from 'express'

import { Paths } from 'testing-support/paths'
import { Paths as DraftSubmittion } from 'claim/paths'
import { ErrorHandling } from 'common/errorHandling'

import { DraftService } from 'services/draftService'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { User } from 'idam/user'
import { DraftClaim } from 'drafts/models/draftClaim'
import { claimDraft as claimDraftData } from '../../../../test/data/draft/createDraft'
import { Draft } from '@hmcts/draft-store-client'
import moment = require('moment')

const draftService = new DraftService()

function getDraftType (req: express.Request): string {
  return Object.keys(req.body.action)[0]
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.createDraftPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.render(Paths.createDraftPage.associatedView)
    })
  )
  .post(Paths.createDraftPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const drafts = await draftService.find(getDraftType(req), '100', user.bearerToken, (value) => value)

      drafts.forEach(async draft => {
        await new DraftService().delete(draft.id, user.bearerToken)
      })

      const claimDraft = new Draft<DraftClaim>(null, 'claim', new DraftClaim().deserialize(claimDraftData), moment(), moment())
      await new DraftService().save(claimDraft, user.bearerToken)

      res.redirect(DraftSubmittion.checkAndSendPage.uri)
    })
  )
