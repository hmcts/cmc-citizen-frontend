import { expect } from 'chai'

import { PersonalDetailsMapper } from 'app/pdf/mappers/personalDetailsMapper'
import { Person } from 'claims/models/person'

describe('PersonalDetailsMapper', () => {
  it('should set correspondence address if one is provided', () => {
    const person = {
      name: 'John Smith',
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
    } as Person

    let mapped = PersonalDetailsMapper.createPersonalDetails(person, 'test@mail.com')

    expect(mapped['correspondenceAddress']).to.deep.equal({
      lineOne: 'First',
      lineTwo: 'Second',
      townOrCity: 'City',
      postcode: 'BB12 7NQ'
    })
  })

  it('should not set correspondence address if one not is provided', () => {
    const person = {
      name: 'John Smith',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      }
    } as Person

    let mapped = PersonalDetailsMapper.createPersonalDetails(person, 'test@mail.com')

    expect(mapped.hasOwnProperty('correspondenceAddress')).to.equal(false)
  })
})
