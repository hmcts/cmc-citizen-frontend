import { partialAdmissionPath } from 'response/paths'
import { PaymentOptionPage } from 'response/components/payment-intention/payment-option'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentOptionPage('partialAdmission')
  .buildRouter(partialAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
