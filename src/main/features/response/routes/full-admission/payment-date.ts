import { fullAdmissionPath } from 'response/paths'
import { PaymentDatePage } from 'response/components/payment-intention/payment-date'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentDatePage('fullAdmission')
  .buildRouter(fullAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
