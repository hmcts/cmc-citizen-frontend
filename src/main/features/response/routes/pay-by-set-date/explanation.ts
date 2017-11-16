import * as express from 'express'
import { PayBySetDatePaths } from 'response/paths'
import { Form } from 'forms/form'
// import { User } from 'idam/user'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'

function renderView (form: Form<PaymentDate>, res: express.Response) {
  res.render(PayBySetDatePaths.explanationPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(PayBySetDatePaths.explanationPage.uri, (req: express.Request, res: express.Response) => {
    // const user: User = res.locals.user
    renderView(Form.empty(), res)
  })
