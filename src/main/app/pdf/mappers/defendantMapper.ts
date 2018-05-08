import { TheirDetails as Defendant } from 'claims/models/details/theirs/theirDetails'
import { TheirDetailsMapper } from 'pdf/mappers/theirDetailsMapper'

export class DefendantMapper {
  static createDefendantDetails (defendant: Defendant, email: string): object {
    return TheirDetailsMapper.createTheirDetails(defendant, email)
  }
}
