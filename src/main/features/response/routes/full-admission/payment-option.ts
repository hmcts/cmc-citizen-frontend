import { fullAdmissionPath } from 'response/paths'
import { PaymentOptionPage } from 'response/components/payment-intention/payment-option'

/* tslint:disable:no-default-export */
export default new PaymentOptionPage('fullAdmission').buildRouter(fullAdmissionPath)
