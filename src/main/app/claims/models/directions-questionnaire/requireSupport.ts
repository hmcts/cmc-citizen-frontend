import { YesNoOption } from 'models/yesNoOption'

export interface RequireSupport {
  languageInterpreter?: string,
  signLanguageInterpreter?: string,
  hearingLoop?: YesNoOption,
  disabledAccess?: YesNoOption,
  otherSupport?: string
}
