import * as express from 'express'

import { Paths } from 'testing-support/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { Form } from 'forms/form'

import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import {
  evidenceDetails,
  claimantPartyDetails,
  defendantPartyDetails
} from '../../../../test/data/draft/partyDetails'
import { MomentFactory } from 'shared/momentFactory'
import { Evidence } from 'forms/models/evidence'
import { FormValidator } from 'forms/validation/formValidator'
import { UpdateClaimDetails } from 'testing-support/models/updateClaimDetails'

const draftService = new DraftService()

function renderView (form: Form<UpdateClaimDetails>, res: express.Response): void {
  res.render(Paths.updateClaimDraftPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.updateClaimDraftPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const drafts = await draftService.find('claim', '100', user.bearerToken, (value) => value)

      renderView(new Form(UpdateClaimDetails.fromObject(drafts[0].document)), res)
    })
  )

  .post(Paths.updateClaimDraftPage.uri,
    FormValidator.requestHandler(UpdateClaimDetails, UpdateClaimDetails.fromObject),
    DraftMiddleware.requestHandler(new DraftService(), 'claim', 100, (value: any): DraftClaim => {
      return new DraftClaim().deserialize(value)
    }),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      const user: User = res.locals.user

      const form: Form<UpdateClaimDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        draft.document.claimant.partyDetails = claimantPartyDetails(form.model.claimantType)
        draft.document.defendant.partyDetails = defendantPartyDetails(form.model.defendantType)

        if (form.model.claimAmount) {
          draft.document.amount.rows[0].amount = form.model.claimAmount
        }
        draft.document.defendant.email.address = form.model.email
        draft.document.reason.reason = form.model.description

        draft.document.claimant.phone.number = MomentFactory.currentDateTime().toISOString()

        if (form.model.evidence) {
          draft.document.evidence = new Evidence().deserialize(evidenceDetails) as Evidence
        }

        await new DraftService().save(draft, user.bearerToken)

        if (form.model.interest) {
          res.redirect(ClaimPaths.interestPage.uri)
        } else {
          res.redirect(ClaimPaths.checkAndSendPage.uri)
        }
      }
    })
  )
