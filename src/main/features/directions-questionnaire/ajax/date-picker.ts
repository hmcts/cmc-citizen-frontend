import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { LocalDate } from 'forms/models/localDate'
import { DraftService } from 'services/draftService'

function renderView (res: express.Response, draft: Draft<DirectionsQuestionnaireDraft>) {
  res.render('date-list', {
    dates: draft.document.availability.unavailableDates,
    externalId: res.locals.claim.externalId
  })
}

export default express.Router()
  .get(Paths.ajaxDatePickerReceiver.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderView(res, draft)
    })
  .post(Paths.ajaxDatePickerReceiver.uri,
    async (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      if (req.params.method === 'add') {
        await addDate(req, res, draft)
      } else if (req.params.method === 'remove') {
        await removeDate(req, res, draft)
      }
      const user = res.locals.user
      await new DraftService().save(draft, user.bearerToken)
      renderView(res, draft)
    })

async function removeDate (req: express.Request, res: express.Response, draft: Draft<DirectionsQuestionnaireDraft>) {
  const toRemove = new LocalDate(req.body.year, req.body.month, req.body.day)
  draft.document.availability.unavailableDates =
    draft.document.availability.unavailableDates.filter(date => date !== toRemove)
}

async function addDate (req: express.Request, res: express.Response, draft: Draft<DirectionsQuestionnaireDraft>) {
  draft.document.availability.unavailableDates.push(new LocalDate(req.body.year, req.body.month, req.body.day))
}
