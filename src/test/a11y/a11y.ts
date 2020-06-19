/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
/* tslint:disable:no-console */

import * as config from 'config'
import * as supertest from 'supertest'
import * as pa11y from 'pa11y'
import { expect } from 'chai'

import { RoutablePath } from 'shared/router/routablePath'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import { ErrorPaths as ClaimIssueErrorPaths, Paths as ClaimIssuePaths } from 'claim/paths'
import { ErrorPaths as DefendantFirstContactErrorPaths, Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import { FullAdmissionPaths, Paths, Paths as DefendantResponsePaths, StatementOfMeansPaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { Paths as OfferPaths } from 'offer/paths'
import { Paths as PaidInFullPaths } from 'paid-in-full/paths'
import { Paths as MediationPaths } from 'mediation/paths'
import { Paths as DirectionQuestionnairePaths } from 'directions-questionnaire/paths'
import { Paths as OrdersPaths } from 'orders/paths'

import 'test/a11y/mocks'
import { app } from 'main/app'
import { MadeBy } from 'claims/models/madeBy'

app.locals.csrf = 'dummy-token'

const cookieName: string = config.get<string>('session.cookieName')

const agent = supertest(app)

interface Issue {
  type,
  code
}

async function runPa11y (url: string): Promise<Issue[]> {
  const result = await pa11y(url, {
    headers: {
      Cookie: `${cookieName}=ABC`
    },
    chromeLaunchConfig: {
      args: ['--no-sandbox']
    }
  })
  return result.issues
    .filter((issue: Issue) => issue.code !== 'WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1')
    .filter((issue: Issue) => issue.code !== 'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.NoContent')
}

function check (uri: string): void {
  describe(`Page ${uri}`, () => {
    it('should have no accessibility errors', async () => {
      const text = await extractPageText(uri)
      ensureHeadingIsIncludedInPageTitle(text)

      const issues: Issue[] = await runPa11y(agent.get(uri).url)
      ensureNoAccessibilityErrors(issues)
    })
  })
}

async function extractPageText (url: string): Promise<string> {
  const res: supertest.Response = await agent.get(url)
    .set('Cookie', `${cookieName}=ABC;state=000MC000`)

  if (res.redirect) {
    throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`)
  }

  if (!res.ok) {
    throw new Error(`Call to ${url} resulted in ${res.status}`)
  }

  return res.text
}

function ensureHeadingIsIncludedInPageTitle (text: string): void {
  const title: string = text.match(/<title>(.*)<\/title>/)[1]
  const heading: RegExpMatchArray = text.match(/<h1 class="heading-large">\s*(.*)\s*<\/h1>/)

  if (heading) { // Some pages does not have heading section e.g. confirmation pages
    expect(title).to.be.equal(`${heading[1]} - Money Claims`)
  } else {
    expect(title).to.be.not.equal(' - Money Claims')
    console.log(`NOTE: No heading found on page titled '${title}' exists`)
  }
}

function ensureNoAccessibilityErrors (issues: Issue[]): void {
  const errors: Issue[] = issues.filter((issue: Issue) => issue.type === 'error')
  expect(errors, `\n${JSON.stringify(errors, null, 2)}\n`).to.be.empty
}

const excludedPaths: Paths[] = [
  ClaimIssuePaths.finishPaymentController,
  ClaimIssuePaths.documentPage,
  ClaimIssuePaths.startPaymentReceiver,
  ClaimIssuePaths.finishPaymentReceiver,
  ClaimIssuePaths.initiatePaymentController,
  ClaimIssuePaths.receiptReceiver,
  ClaimIssuePaths.sealedClaimPdfReceiver,
  DefendantResponsePaths.receiptReceiver,
  DefendantResponsePaths.legacyDashboardRedirect,
  OfferPaths.agreementReceiver,
  DefendantFirstContactPaths.receiptReceiver,
  ClaimantResponsePaths.receiptReceiver,
  DirectionQuestionnairePaths.claimantHearingRequirementsReceiver,
  ClaimantResponsePaths.courtOfferedSetDatePage,
  DirectionQuestionnairePaths.hearingDatesDeleteReceiver,
  DirectionQuestionnairePaths.hearingDatesReplaceReceiver,
  DirectionQuestionnairePaths.hearingDatesPage,
  OrdersPaths.reviewOrderReceiver,
  OrdersPaths.directionsOrderDocument,
  MediationPaths.mediationAgreementDocument
]

describe('Accessibility', () => {
  function checkPaths (pathsRegistry: object): void {
    Object.values(pathsRegistry).forEach((path: RoutablePath) => {
      const excluded = excludedPaths.some(_ => _ === path)
      if (!excluded) {
        if (path.uri.includes(':madeBy')) {
          check(path.evaluateUri({ externalId: '91e1c70f-7d2c-4c1e-a88f-cbb02c0e64d6', madeBy: MadeBy.CLAIMANT.value }))
        } else if (path.uri.includes(':externalId')) {
          check(path.evaluateUri({ externalId: '91e1c70f-7d2c-4c1e-a88f-cbb02c0e64d6' }))
        } else {
          check(path.uri)
        }
      }
    })
  }

  checkPaths(EligibilityPaths)
  checkPaths(ClaimIssuePaths)
  checkPaths(ClaimIssueErrorPaths)
  checkPaths(DefendantFirstContactPaths)
  checkPaths(DefendantFirstContactErrorPaths)
  checkPaths(DefendantResponsePaths)
  checkPaths(CCJPaths)
  checkPaths(OfferPaths)
  checkPaths(StatementOfMeansPaths)
  checkPaths(FullAdmissionPaths)
  checkPaths(ClaimantResponsePaths)
  checkPaths(PaidInFullPaths)
  checkPaths(MediationPaths)
  checkPaths(DirectionQuestionnairePaths)
  checkPaths(OrdersPaths)
})
