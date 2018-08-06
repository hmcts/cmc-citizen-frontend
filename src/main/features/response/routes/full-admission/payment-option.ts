import { fullAdmissionPath } from 'response/paths'
import { PaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentOptionPage('fullAdmission')
  .buildRouter(fullAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
