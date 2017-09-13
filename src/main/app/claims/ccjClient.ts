import User from 'app/idam/user'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { MomentFactory } from 'common/momentFactory'
import { DATE_FORMAT } from 'utils/momentFormatter'

export class CCJClient {
  static save (user: User): Promise<object> {
    const convertedDraft = CCJModelConverter.convert(user.ccjDraft)
    return Promise.resolve(convertedDraft)
  }
  static retrieve (externalId: number): Promise<object> {
    if (!externalId) {
      return Promise.reject(new Error('External ID is required'))
    }

    return Promise.resolve({
      defendantName: 'Jonny jones',
      judgmentDeadline: MomentFactory.currentDate().add(20, 'days').format(DATE_FORMAT)
    })
  }
}
