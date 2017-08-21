import { expect } from 'chai'

import { DefendantMapper } from 'app/pdf/mappers/defendantMapper'
import { TheirDetails as Defendant } from 'claims/models/details/theirs/theirDetails'

describe('DefendantMapper', () => {
  let defendant: Defendant

  beforeEach(() => {
    defendant = {
      type: 'individual',
      name: 'John Smith',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
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
})
