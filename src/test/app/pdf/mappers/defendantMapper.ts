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
})
