import { partialAdmissionPath } from 'response/paths'
import { PaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentDatePage('partialAdmission')
  .buildRouter(partialAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
