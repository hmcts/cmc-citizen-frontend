import { YesNoOption } from 'claims/models/response/core/yesNoOption'

export interface RequireSupport {
  languageInterpreter?: string,
  signLanguageInterpreter?: string,
  hearingLoop?: YesNoOption,
  disabledAccess?: YesNoOption,
  otherSupport?: string
}
