import * as express from 'express'

import { Paths } from 'testing-support/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { Form } from 'forms/form'

import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { DraftClaim } from 'drafts/models/draftClaim'
import { prepareClaimDraft } from 'drafts/draft-data/claimDraft'
import { Draft } from '@hmcts/draft-store-client'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { PartyType } from 'common/partyType'
import {
  claimantSoleTraderDetails,
  companyDetails,
  organisationDetails,
  defendantSoleTraderDetails,
  evidenceDetails
} from '../../../../test/data/draft/partyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { Timeline } from 'forms/models/timeline'
import { ClaimantTimeline } from 'claim/form/models/claimantTimeline'
import { MomentFactory } from 'shared/momentFactory'
import { Evidence } from 'forms/models/evidence'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const draftService = new DraftService()

function getDraftType (req: express.Request): string {
  return Object.keys(req.body.action)[0]
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.updateClaimDraftPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const drafts = await draftService.find('claim', '100', user.bearerToken, (value) => value)
      const draft = drafts[0]
      const form = new Form(draft.document)
      let timelineFlag = false
      if (draft.document.timeline.rows.length) {
        timelineFlag = true
      }
      res.render(Paths.updateClaimDraftPage.associatedView, {
        form: form,
        timelineFlag: timelineFlag
      })
    })
  )
  .post(Paths.updateClaimDraftPage.uri,
    DraftMiddleware.requestHandler(new DraftService(), 'claim', 100, (value: any): DraftClaim => {
      return new DraftClaim().deserialize(value)
    }),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      const user: User = res.locals.user

      const form = req.body
      switch (form.claimantType) {
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          draft.document.claimant.partyDetails = new SoleTraderDetails().deserialize(claimantSoleTraderDetails)
          break
        case PartyType.COMPANY.value:
          draft.document.claimant.partyDetails = new CompanyDetails().deserialize(organisationDetails)
          break
        case PartyType.ORGANISATION.value:
          draft.document.claimant.partyDetails = new OrganisationDetails().deserialize(companyDetails)
          break
      }

      switch (form.defendantType) {
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          draft.document.defendant.partyDetails = new SoleTraderDetails().deserialize(defendantSoleTraderDetails)
          break
        case PartyType.COMPANY.value:
          draft.document.defendant.partyDetails = new CompanyDetails().deserialize(organisationDetails)
          break
        case PartyType.ORGANISATION.value:
          draft.document.defendant.partyDetails = new OrganisationDetails().deserialize(companyDetails)
          break
      }

      draft.document.amount.rows[0].amount = form.claimAmount
      draft.document.defendant.email.address = form['defendant.email.address']
      draft.document.reason.reason = form.description

      draft.document.claimant.phone.number = MomentFactory.currentDateTime().toISOString()

      if (form.evidence) {
        draft.document.evidence = new Evidence().deserialize(evidenceDetails) as Evidence
      } else {
        draft.document.evidence = new Evidence() as Evidence
      }

      await new DraftService().save(draft, user.bearerToken)

      if (form.interest) {
        res.redirect(ClaimPaths.interestPage.uri)
      } else {
        res.redirect(ClaimPaths.checkAndSendPage.uri)
      }
    })
  )
