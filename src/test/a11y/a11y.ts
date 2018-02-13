/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
import * as config from 'config'
import * as supertest from 'supertest'
import * as pa11y from 'pa11y'
import * as promisify from 'es6-promisify'
import { expect } from 'chai'

import { RoutablePath } from 'common/router/routablePath'
import { ErrorPaths as ClaimIssueErrorPaths, Paths as ClaimIssuePaths } from 'claim/paths'
import { ErrorPaths as DefendantFirstContactErrorPaths, Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import { Paths as DefendantResponsePaths, StatementOfMeansPaths, PayBySetDatePaths } from 'response/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { Paths as OfferPaths } from 'offer/paths'

import './mocks'
import { app } from '../../main/app'

app.locals.csrf = 'dummy-token'

const cookieName: string = config.get<string>('session.cookieName')

const agent = supertest.agent(app)
const pa11yTest = pa11y({
  page: {
    headers: {
      Cookie: `${cookieName}=ABC`
    }
  }
})
const test = promisify(pa11yTest.run, pa11yTest)

function check (url: string): void {
  describe(`Page ${url}`, () => {

    it('should have no accessibility errors', (done) => {
      ensurePageCallWillSucceed(url)
        .then(() =>
          test(agent.get(url).url)
        )
        .then((messages) => {
          const errors = messages.filter((m) => m.type === 'error')
          expect(errors, `\n${JSON.stringify(errors, null, 2)}\n`).to.be.empty
          done()
        })
        .catch((err) => done(err))
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
