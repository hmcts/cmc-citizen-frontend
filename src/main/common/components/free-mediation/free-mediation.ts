import * as express from 'express'

import { Paths as FreeMediationPaths } from 'shared/components/free-mediation/paths'

import { Form } from 'main/app/forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { FreeMediation } from 'main/features/response/form/models/freeMediation'

import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { Claim } from 'main/app/claims/models/claim'

import { ErrorHandling } from 'main/common/errorHandling'

/* tslint:disable:no-default-export */
export abstract class AbstractFreeMediationPage {
  abstract redirectUri (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(
        path + FreeMediationPaths.freeMediationPage.uri,
        ...guards,
        (req: express.Request, res: express.Response) => {
          const draft: Draft<any> = res.locals.draft

          this.renderView(new Form(draft.document.freeMediation), res)
        })
      .post(
        path + FreeMediationPaths.freeMediationPage.uri,
        ...guards,
        FormValidator.requestHandler(FreeMediation),
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const form: Form<FreeMediation> = req.body

          if (form.hasErrors()) {
            this.renderView(form, res)
          } else {
            const draft: Draft<any> = res.locals.draft
            const user: User = res.locals.user

            draft.document.freeMediation = form.model
            await new DraftService().save(draft, user.bearerToken)

            res.redirect(this.redirectUri(req, res))
          }
        }))
  }

  private renderView (form: Form<FreeMediation>, res: express.Response) {
    const claim: Claim = res.locals.claim
    // const draft: any = res.locals.draft
    // const amount = draft.isResponsePartiallyAdmitted() ? draft.partialAdmission.howMuchDoYouOwe.amount : 0

    res.render('components/free-mediation/free-mediation', {
      form: form,
      claimantFullName: claim.claimData.claimant.name,
      // amount: amount
    })
  }
}
