import { partialAdmissionPath } from 'response/paths'
import { PaymentPlanPage } from 'shared/components/payment-intention/payment-plan'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentPlanPage('partialAdmission')
  .buildRouter(partialAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
