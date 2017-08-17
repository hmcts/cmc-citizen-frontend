import * as supertest from 'supertest'
import * as pa11y from 'pa11y'
import * as promisify from 'es6-promisify'
import { expect } from 'chai'

import { RoutablePath } from 'common/router/routablePath'
import { ErrorPaths as ClaimIssueErrorPaths, Paths as ClaimIssuePaths } from 'claim/paths'
import { ErrorPaths as DefendantFirstContactErrorPaths, Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import { Paths as DefendantResponsePaths } from 'response/paths'

import './mocks'
import { app } from '../../main/app'

const agent = supertest.agent(app)
const pa11yTest = pa11y()
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
          /* tslint:disable:no-unused-expression */
          // need a better solution at some point, https://github.com/eslint/eslint/issues/2102
          expect(errors, `\n${JSON.stringify(errors, null, 2)}\n`).to.be.empty
          /* tslint:enable:no-unused-expression */
          done()
        })
        .catch((err) => done(err))
    })
  })
}

function ensurePageCallWillSucceed (url: string): Promise<void> {
  return agent.get(url)
    .then((res: supertest.Response) => {
      if (res.redirect) {
        throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`)
      }
      if (res.serverError) {
        throw new Error(`Call to ${url} resulted in internal server error`)
      }
    })
}

const excludedPaths: DefendantResponsePaths[] = [
  ClaimIssuePaths.claimantLoginReceiver,
  ClaimIssuePaths.startPaymentReceiver,
  ClaimIssuePaths.finishPaymentReceiver,
  ClaimIssuePaths.receiptReceiver,
  ClaimIssuePaths.defendantResponseCopy,
  DefendantResponsePaths.defendantLoginReceiver,
  DefendantResponsePaths.defendantLinkReceiver,
  DefendantResponsePaths.receiptReceiver
]

describe('Accessibility', () => {
  function checkPaths (pathsRegistry: object): void {
    Object.values(pathsRegistry).forEach((path: RoutablePath) => {
      const excluded = excludedPaths.some(_ => _ === path)
      if (!excluded) {
        check(path.uri)
      }
    })
  }

  checkPaths(ClaimIssuePaths)
  checkPaths(ClaimIssueErrorPaths)
  checkPaths(DefendantFirstContactPaths)
  checkPaths(DefendantFirstContactErrorPaths)
  checkPaths(DefendantResponsePaths)
})
