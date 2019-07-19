import { MomentFactory } from 'shared/momentFactory'
import { mockNextWorkingDay } from '../../http-mocks/claim-store'
import { expect } from 'chai'
import { CalendarClient } from 'claims/calendarClient'
import * as nock from 'nock'
import { claimApiBaseUrl } from 'claims/claimStoreClient'

describe('calendar', () => {
  const mockClient = 'http://localhost'
  const url: string = `${claimApiBaseUrl}/calendar/next-working-day`
  const SATURDAY = MomentFactory.parse('2019-06-29')
  const MONDAY_AFTER = '2019-07-01'
  let calendarClient: CalendarClient = new CalendarClient()

  beforeEach(() => {
    calendarClient = new CalendarClient()
  })

  it(`should return following Monday when date is Saturday and no days to add`, async () => {
    mockNextWorkingDay(MONDAY_AFTER)

    const nextWorkingDay = await calendarClient.getNextWorkingDay(SATURDAY, 0)

    expect(nextWorkingDay.toISOString(false)).to.equal(MomentFactory.parse(MONDAY_AFTER).toISOString(false))
  })

  it('should return Unable to get next working day bad request', () => {
    nock(mockClient)
      .get(url)
      .reply(400)

    return calendarClient.getNextWorkingDay(SATURDAY, 0)
      .catch(err =>
        expect(err.toString()).to.contains('Unable to get next working day')
      )
  })

  it('should return Missing date when no date is passed', () => {
    mockNextWorkingDay(MONDAY_AFTER)

    return calendarClient.getNextWorkingDay(undefined, 0)
      .catch(err =>
        expect(err.toString()).to.contains('Missing date')
      )
  })

})
