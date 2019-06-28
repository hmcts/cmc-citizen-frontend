import { request } from 'client/request'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { MomentFormatter } from 'utils/momentFormatter'
import { Moment } from 'moment'

export class CalendarClient {

  static getNextWorkingDay (date: Moment): Promise<Moment> {
    const url: string = `${claimApiBaseUrl}/calendar/next-working-day`

    const formattedDate: string = MomentFormatter.formatDate(date)

    return request.get(
      `${url}?date=${formattedDate}`
    ).then(response => response.nextWorkingDay)
  }
}
