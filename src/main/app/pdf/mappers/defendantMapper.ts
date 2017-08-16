import { MomentFormatter } from 'app/utils/momentFormatter'
import { Defendant } from 'app/claims/models/defendant'
import { PersonalDetailsMapper } from 'app/pdf/mappers/personalDetailsMapper'

export class DefendantMapper {
  static createDefendantDetails (defendant: Defendant, email: string): object {
    let mapped = PersonalDetailsMapper.createPersonalDetails(defendant, email)
    mapped['dateOfBirth'] = MomentFormatter.formatLongDate(defendant.dateOfBirth)
    return mapped
  }
}
