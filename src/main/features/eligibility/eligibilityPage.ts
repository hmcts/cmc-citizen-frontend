import * as express from 'express'

import { RoutablePath } from 'shared/router/routablePath'
import { ErrorHandling } from 'shared/errorHandling'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { Eligibility } from 'eligibility/model/eligibility'
import { EligibilityCheck } from 'eligibility/model/eligibilityCheck'

import { CookieEligibilityStore } from 'eligibility/store'

const eligibilityStore: CookieEligibilityStore = new CookieEligibilityStore()

  export abstract class EligibilityPage<T> {
  protected constructor (private path: RoutablePath, private property: string) {
  }

  buildRouter (): express.Router {
    return express.Router()
      .get(this.path.uri, (req: express.Request, res: express.Response): void => {
        this.renderView(new Form(eligibilityStore.read(req, res)), res)
      })
      .post(this.path.uri,
        FormValidator.requestHandler(undefined, Eligibility.fromObject, this.property),
        ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
          const form: Form<Eligibility> = req.body

          if (form.hasErrors()) {
            this.renderView(form, res)
          } else {
            let eligibility: Eligibility = eligibilityStore.read(req, res)
            if (eligibility === undefined) {
              eligibility = new Eligibility()
            }

            eligibility[this.property] = form.model[this.property]
            eligibilityStore.write(eligibility, req, res)

            await this.handleAnswer(eligibility[this.property], res)
          }
        })
      )
  }

  private renderView (form: Form<Eligibility>, res: express.Response): void {
    res.render(this.path.associatedView, { form })
  }

  protected async handleAnswer (value: T, res: express.Response) {
    const result: EligibilityCheck = await this.checkEligibility(value)
      .catch(err => {
        throw new Error(err)
      })

    if (result.eligible) {
      res.redirect((await this.nextPagePath()).uri)
    } else if (result.notEligibleReason) {
      res.redirect(`${result.notEligiblePage.uri}?reason=${result.notEligibleReason}`)
    } else {
      res.redirect(result.notEligiblePage.uri)
    }
  }

  protected abstract async nextPagePath (): Promise<RoutablePath>

  protected abstract checkEligibility (value: T): Promise<EligibilityCheck>
}
