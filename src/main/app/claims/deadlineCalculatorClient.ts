import { request } from 'client/request'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { MomentFormatter } from 'utils/momentFormatter'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class DeadlineCalculatorClient {
  static calculatePostponedDeadline (issueDate: Moment): Promise<Moment> {
    const url: string = `${claimApiBaseUrl}/deadline`

    const from: string = MomentFormatter.formatDate(issueDate)

    return request.get(
      `${url}/${from}`
    ).then(response => MomentFactory.parse(response))
  }
}
