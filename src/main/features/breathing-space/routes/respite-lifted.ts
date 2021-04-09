import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { BreathingSpaceLiftDate } from '../models/bsLiftDate'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { LocalDate } from 'forms/models/localDate'
import { prepareClaimDraft } from 'drafts/draft-data/claimDraft'
import { ClaimStoreClient } from 'claims/claimStoreClient'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
let breathingSpaceExternalId = null

function renderView (form: Form<BreathingSpaceLiftDate>, res: express.Response, next: express.NextFunction) {
  const currentDate: Moment = MomentFactory.currentDate().add(0, 'days')
  res.render(Paths.bsLiftPage.associatedView, {
    form: form,
    breathingSpaceExternalId: breathingSpaceExternalId,
    currentDate: currentDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsLiftPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const claim = externalId !== undefined ? await claimStoreClient.retrieveByExternalId(externalId, res.locals.user) : undefined
      const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)

      let bsDraft: Draft<DraftClaim> = res.locals.bsDraft
      if (drafts.length > 1) {
        drafts.forEach(async draftBs => {
          await new DraftService().delete(draftBs.id, res.locals.user.bearerToken)
        })
      } else if (drafts.length === 0) {
        bsDraft.document = new DraftClaim().deserialize(prepareClaimDraft(res.locals.user.email, false))
        bsDraft.document.breathingSpace = claim.claimData.breathingSpace
        bsDraft.document.breathingSpace.breathingSpaceExternalId = externalId
        await new DraftService().save(bsDraft, res.locals.user.bearerToken)
      }

      const bsDrafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
      let draft: Draft<DraftClaim> = bsDrafts[bsDrafts.length - 1]
      breathingSpaceExternalId = draft.document.breathingSpace.breathingSpaceExternalId.toString()
      if (draft.document.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate) {
        let bsLiftDate: Date = new Date(draft.document.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate.toLocaleString())
        let bsLiftDateSplit = bsLiftDate.toLocaleDateString().split('/')
        let bsLiftDateBy: LocalDate = new LocalDate(parseInt(bsLiftDateSplit[2], 10),parseInt(bsLiftDateSplit[0], 10), parseInt(bsLiftDateSplit[1], 10))
        renderView(new Form(new BreathingSpaceLiftDate(bsLiftDateBy)), res, next)
      } else {
        renderView(new Form(new BreathingSpaceLiftDate()), res, next)
      }
    })
    .post(
        Paths.bsLiftPage.uri,
        FormValidator.requestHandler(BreathingSpaceLiftDate, BreathingSpaceLiftDate.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          const form: Form<BreathingSpaceLiftDate> = req.body
          if ((form.model.respiteLiftDate.day || form.model.respiteLiftDate.month || form.model.respiteLiftDate.year) && form.hasErrors()) {
            renderView(form, res, next)
          } else {
            const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
            let draft: Draft<DraftClaim> = drafts[drafts.length - 1]
            const user: User = res.locals.user
            draft.document.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate = MomentFactory.parse(form.model.respiteLiftDate.toMoment().format())
            await new DraftService().save(draft, user.bearerToken)
            res.redirect(Paths.bsLiftCheckAnswersPage.uri)
          }
        }))
