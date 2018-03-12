import { Form } from 'app/forms/form'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { ErrorHandling } from 'common/errorHandling'
import { RoutablePath } from 'common/router/routablePath'
import { CookieEligibilityStore, EligibilityStore } from 'eligibility/store'
import * as express from 'express'
import { FormValidator } from 'forms/validation/formValidator'

const eligibilityStore: EligibilityStore = new CookieEligibilityStore()

export abstract class EligibilityPage<T> {
  constructor (private path: RoutablePath, private property: string) {}

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

            this.checkValue(eligibility[this.property], res)
          }
        })
      )
  }

  private renderView (form: Form<Eligibility>, res: express.Response): void {
    res.render(this.path.associatedView, {
      form: form
    })
  }

  abstract checkValue (value: T, res: express.Response): void
}
