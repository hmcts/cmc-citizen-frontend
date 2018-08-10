import { partialAdmissionPath } from 'response/paths'
import { PaymentPlanPage } from 'response/components/payment-intention/payment-plan'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentPlanPage('partialAdmission')
  .buildRouter(partialAdmissionPath, OptInFeatureToggleGuard.featureEnabledGuard('admissions'))
