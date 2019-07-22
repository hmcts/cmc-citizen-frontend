import { MomentFactory } from 'shared/momentFactory'
import { expect } from 'chai'
import { CalendarClient } from 'claims/calendarClient'
import { mockNextWorkingDay, rejectNextWorkingDay } from 'test/http-mocks/claim-store'

describe('calendar', () => {
  const SATURDAY = MomentFactory.parse('2019-06-29')
  const MONDAY_AFTER = '2019-06-29'
  let calendarClient: CalendarClient = new CalendarClient()

  beforeEach(() => {
    calendarClient = new CalendarClient()
  })

  it('should return correct date when calendar api is called', async () => {
    mockNextWorkingDay(SATURDAY)

    const nextWorkingDay = await calendarClient.getNextWorkingDay(SATURDAY, 5)

    expect(nextWorkingDay.toISOString()).to.equal(MomentFactory.parse(MONDAY_AFTER).toISOString())
  })

  it('should return Unable to get next working day bad request', () => {
    rejectNextWorkingDay(SATURDAY)

    return calendarClient.getNextWorkingDay(SATURDAY, 0)
      .catch(err =>
        expect(err.toString()).to.contains('Unable to get next working day')
      )
  })

  it('should return Missing date error when no date is passed', () => {
    mockNextWorkingDay(SATURDAY)

    return calendarClient.getNextWorkingDay(undefined, 0)
      .catch(err =>
        expect(err.toString()).to.contains('Missing date')
      )
  })

})
