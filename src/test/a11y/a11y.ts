/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
import * as config from 'config'
import * as supertest from 'supertest'
import * as pa11y from 'pa11y'
import { expect } from 'chai'

import { RoutablePath } from 'common/router/routablePath'
import { ErrorPaths as ClaimIssueErrorPaths, Paths as ClaimIssuePaths } from 'claim/paths'
import { ErrorPaths as DefendantFirstContactErrorPaths, Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import { Paths as DefendantResponsePaths, StatementOfMeansPaths, PayBySetDatePaths } from 'response/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { Paths as OfferPaths } from 'offer/paths'

import './mocks'
import { app } from '../../main/app'
import { Logger } from '@hmcts/nodejs-logging'

app.locals.csrf = 'dummy-token'

const cookieName: string = config.get<string>('session.cookieName')
const logger = Logger.getLogger('a11y')

const agent = supertest.agent(app)

class Issue {
  code
  context
  message
  type
  typeCode
  selector
}

async function runPa11y (url): Promise<boolean> {
  try {
    const results = await pa11y(agent.get(url).url, {
      headers: {
        Cookie: `${cookieName}=ABC`
      }
    })

    const errors: Issue[] = results.issues

    if (errors.length === 0) {
      return true
    } else {
      errors.forEach(error => {
        logger.error(error.message)
      })
      return false
    }
  } catch (error) {
    throw new Error(error)
  }
}

function check (url: string): void {
  describe(`Page ${url}`, () => {
    it('should have no accessibility errors', async () => {
      try {
        await ensurePageCallWillSucceed(url)
        expect(await runPa11y(url)).to.be.equal(true)
      } catch (error) {
        throw new Error(error)
      }
    })
  })
}

function ensurePageCallWillSucceed (url: string): Promise<void> {
  return agent.get(url)
    .set('Cookie', `${cookieName}=ABC;state=000MC000`)
    .then((res: supertest.Response) => {
      if (res.redirect) {
        throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`)
      }

      if (!res.ok) {
        throw new Error(`Call to ${url} resulted in ${res.status}`)
      }
    })
}

const excludedPaths: DefendantResponsePaths[] = [
  ClaimIssuePaths.startPaymentReceiver,
  ClaimIssuePaths.finishPaymentReceiver,
  ClaimIssuePaths.receiptReceiver,
  DefendantResponsePaths.receiptReceiver,
  DefendantResponsePaths.legacyDashboardRedirect,
  OfferPaths.agreementReceiver
]

describe('Accessibility', () => {
  function checkPaths (pathsRegistry: object): void {
    Object.values(pathsRegistry).forEach((path: RoutablePath) => {
      const excluded = excludedPaths.some(_ => _ === path)
      if (!excluded) {
        if (path.uri.includes(':externalId')) {
          check(path.evaluateUri({ externalId: '91e1c70f-7d2c-4c1e-a88f-cbb02c0e64d6' }))
        } else {
          check(path.uri)
        }
      }
    })
  }

  checkPaths(ClaimIssuePaths)
  checkPaths(ClaimIssueErrorPaths)
  checkPaths(DefendantFirstContactPaths)
  checkPaths(DefendantFirstContactErrorPaths)
  checkPaths(DefendantResponsePaths)
  checkPaths(CCJPaths)
  checkPaths(OfferPaths)
  checkPaths(StatementOfMeansPaths)
  checkPaths(PayBySetDatePaths)
})
