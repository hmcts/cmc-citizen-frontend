import { fullAdmissionPath } from 'response/paths'
import { PaymentDatePage } from 'response/components/payment-intention/payment-date'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

/* tslint:disable:no-default-export */
export default new PaymentDatePage('fullAdmission')
  .buildRouter(fullAdmissionPath, OptInFeatureToggleGuard.featureEnabledGuard('admissions'))
