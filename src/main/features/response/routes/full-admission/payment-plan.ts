import { fullAdmissionPath } from 'response/paths'
import { PaymentPlanPage } from 'response/components/payment-intention/payment-plan'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentPlanPage('fullAdmission')
  .buildRouter(fullAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
