import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly referencNumberPage = new RoutablePath('/breathing-space/reference-number')
  static readonly bsStartDatePage = new RoutablePath('/breathing-space/respite-start')
  static readonly bsTypePage = new RoutablePath('/breathing-space/respite-type')
  static readonly bsEndDatePage = new RoutablePath('/breathing-space/respite-end')
  static readonly bsCheckAnswersPage = new RoutablePath('/breathing-space/check-answers')
}
