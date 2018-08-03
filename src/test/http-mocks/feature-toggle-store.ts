import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = config.get<string>('feature-toggles-api.url')

export function resolveIsAdmissionsAllowed () {
  mock(`${serviceBaseURL}/api/ff4j`)
    .get(new RegExp('/check/cmc_admissions'))
    .reply(HttpStatus.OK, true)
}
