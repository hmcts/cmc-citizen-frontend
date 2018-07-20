import * as express from 'express'

import { fullAdmissionPath } from 'response/paths'
import { PaymentOptionPage } from 'response/components/payment-intention/payment-option'

/* tslint:disable:no-default-export */
export default express.Router()
  .use(fullAdmissionPath, new PaymentOptionPage('fullAdmission').buildRouter())
