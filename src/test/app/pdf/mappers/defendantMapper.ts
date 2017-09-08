import { expect } from 'chai'

import { DefendantMapper } from 'app/pdf/mappers/defendantMapper'
import { Defendant } from 'claims/models/defendant'
import * as moment from 'moment'

describe('DefendantMapper', () => {
  let defendant: Defendant

  beforeEach(() => {
    defendant = {
      name: 'John Smith',
      dateOfBirth: moment({ year: 1990, month: 2, day: 11 }),
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      },
      correspondenceAddress: {
        line1: 'First',
        line2: 'Second',
        city: 'City',
        postcode: 'BB12 7NQ'
      }
    } as Defendant
  })

  it('should set correspondence address if one is provided', () => {
    let mapped = DefendantMapper.createDefendantDetails(defendant, 'test@mail.com')

    expect(mapped['correspondenceAddress']).to.deep.equal({
      lineOne: 'First',
      lineTwo: 'Second',
      townOrCity: 'City',
      postcode: 'BB12 7NQ'
    })
  })

  it('should not set correspondence address if one not is provided', () => {
    delete defendant.correspondenceAddress

    let mapped = DefendantMapper.createDefendantDetails(defendant, 'test@mail.com')

    expect(mapped.hasOwnProperty('correspondenceAddress')).to.equal(false)
  })

  it('should map the date of birth', () => {
    let mapped = DefendantMapper.createDefendantDetails(defendant, 'test@mail.com')

    expect(mapped['dateOfBirth']).to.equal('11 March 1990')
  })
})
