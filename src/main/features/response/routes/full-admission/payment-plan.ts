import { fullAdmissionPath } from 'response/paths'
import { PaymentPlanPage } from 'response/components/payment-intention/payment-plan'

/* tslint:disable:no-default-export */
export default new PaymentPlanPage('fullAdmission').buildRouter(fullAdmissionPath)
