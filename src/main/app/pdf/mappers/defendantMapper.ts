import { TheirDetails as Defendant } from 'app/claims/models/details/theirs/theirDetails'
import { TheirDetailsMapper } from 'app/pdf/mappers/theirDetailsMapper'

export class DefendantMapper {
  static createDefendantDetails (defendant: Defendant, email: string): object {
    let mapped = TheirDetailsMapper.createTheirDetails(defendant, email)
    return mapped
  }
}
