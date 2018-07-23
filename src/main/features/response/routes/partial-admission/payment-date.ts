import { partialAdmissionPath } from 'response/paths'
import { PaymentDatePage } from 'response/components/payment-intention/payment-date'

/* tslint:disable:no-default-export */
export default new PaymentDatePage('partialAdmission').buildRouter(partialAdmissionPath)
